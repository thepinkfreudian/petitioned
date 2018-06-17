var PetitionContract = function() {
    LocalContractStorage.defineProperty(this, 'petition_count')
    LocalContractStorage.defineProperty(this, 'log_count')
    LocalContractStorage.defineMapProperty(this, 'petition_id_to_data')
    LocalContractStorage.defineMapProperty(this, 'log_id_to_data')
}

PetitionContract.prototype = {
    init: function() {
        this.petition_count = 1;
        this.log_count = 1;
    },

    getPetitions: function() {
        var petitions = [];

        for (var i = 1; i < this.petition_count; i++) {
            var petition = this.petition_id_to_data.get(i);
            if (petition) {
                petitions.push(petition);
            }
        }

        return petitions
    },

    getPetition: function(petition_id) {
        var petition_data = this.petition_id_to_data.get(petition_id);
        if (petition_data) {
            return petition_data
        }
    },

    getSignatures: function(petition_id) {
        var signatures = [];

        for (var i = 1; i < this.log_count; i++) {
            var signature = this.log_id_to_data.get(i);
            if (signature.petition_id === petition_id) {
                signatures.push(signature);
            }
        }

        return signatures
    },

    addPetition: function(title, description) {

        assertNoValue(Blockchain.transaction.value);

        var petition_id = this.petition_count;
        this.petition_count++;

        var petition_data = {
            petition_id: petition_id,
            title: title,
            description: description,
            created_by: Blockchain.transaction.from,
            signatures: 0,
            reports: 0,
            created_date: Date.now()
        }

        this.petition_id_to_data.put(petition_id, petition_data);

    },

    signPetition: function(petition_id) {

        var address = Blockchain.transaction.from;
        assertHasNotSigned(this, address, petition_id);
        assertNoValue(Blockchain.transaction.value);

       var log_id = this.log_count;
        this.log_count++;

        var petition_data = this.petition_id_to_data.get(petition_id);
        petition_data.signatures++;

        var log_data = {
            address: address,
            petition_id: petition_id,
            date: Date.now()
        }

        this.petition_id_to_data.put(petition_id, petition_data);
        this.log_id_to_data.put(log_id, log_data);
    },

    reportPetition: function(petition_id) {

        assertNoValue(Blockchain.transaction.value);

        var petition_data = this.petition_id_to_data.get(petition_id);
        petition_data.reports++;

        if (petition_data.reports === 3) {
            this.petition_id_to_data.delete(petition_id);
        }
        else {
            this.petition_id_to_data.put(petition_id, petition_data);
        }
    }

}

module.exports = PetitionContract

function assertNoValue(value) {
    if (value != 0) {
        throw new Error('Users only pay for gas.');
    }
}

function assertHasNotSigned(contract, address, petition_id) {
    for (var i = 1; i < contract.log_count; i++) {
        var log = contract.log_id_to_data.get(i);

        if (log.address === address && log.petition_id === petition_id) {
            throw new Error('You have already signed this petition.');
        } 
    }
}