$(document).ready(function() {

    $('#no-data').hide();
    $('#error-info').hide();

    // modal logic
    var modal = $('#petition-info');
    $("#create-btn").click(function() {
        modal.css('display', 'block');
    });

    $('.close').click(function() {
        modal.css('display', 'none');
    });

    $(document).click(function(event) {
        if (event.target == modal) {
            modal.css('display', 'none');
        }
    });

   $('#add-btn').click(function() {
       var title = $('#add-title').val();
       var description = $('#add-desc').val();

       if(!title) {
           alert('Please enter a valid title.');
           return
       }

        addPetition([title, description]);
        modal.css('display', 'none');
        $('#add-title').val('');
        $('#add-desc').val('');
    });

    // populate petition-grid
    getPetitions();
})

function getPetitions() {

    nebReadAnon('getPetitions', null, function(result, error) {

        $('#error-info').hide();
        $('#no-data').hide();

        if (!result) {
            $('#error-info').show();
            $('#error-info').text(error);
        }

        if (result.length === 0) {
            $('.grid-item').hide();
            $('#no-data').show();
        }

        else {
            populatePetitions(result);
        } 
        
    });
}

function addPetition(args) {
    nebPay.call(contract_address, 0, 'addPetition', JSON.stringify(args), {
        callback: nebulas_domain,
        listener: onWriteTx
    })
}

function signPetition(petition_id) {
    nebPay.call(contract_address, 0, 'signPetition', JSON.stringify([petition_id]), {
        callback: nebulas_domain,
        listener: onWriteTx
    });
}

function reportPetition(petition_id) {
    nebPay.call(contract_address, 0, 'reportPetition', JSON.stringify([petition_id]), {
        callback: nebulas_domain,
        listener: onWriteTx
    })
}

function onWriteTx(resp) {
    
    function poll() {
        getTxStatus(resp.txhash, function(resp) {
            $('#error-info').hide();
            var error = resp.execute_error;

            if (error) {
                $('#tx-pending').hide();
                $('#error-info').show();
                $('#error-info').text(error);
            }

            else if (resp.status == 1) {
                $('#tx-pending').hide();
                getPetitions();
            } 
            
            else {
                setTimeout(poll, 5000);
                $('#tx-pending').show();
                $('#tx-pending').html('<span>sending transaction... </span><div class="loading"></div>');
            }
        });
    }
    poll();
}

function populatePetitions(result) {
    var html = '';
    $('#petition-grid').text('');

    for (var i = 0; i < result.length; i++) {
        var created_date = formatDate(result[i].created_date);
        var created_by = formatAddress(result[i].created_by);
        if (result[i].title.length > 40) {
            var title = result[i].title.substring(0, 40) + '...';
        } 
        else {
            title = result[i].title;
        }

        if (result[i].signatures === 1) {
            var signature_caption = 'signature';
        }
        else {
            signature_caption = 'signatures';
        }

        html += '<div class="grid-item" id="petition-' + result[i].petition_id +'">';
        html += '<span class="petition-title">' + title + '</span>';
        html += '<span class="petition-creator">Author: ' + created_by + '</span>';
        html += '<span class="petition-signature-count">' + result[i].signatures + '</span>';
        html += '<span class="petition-signature-caption">' + signature_caption + '</span>';
        html += '<span class="petition-created">Created: ' + created_date + '</span>';
        html += '<button class="btn sign-petition-btn" onclick="signPetition(\''+ result[i].petition_id + '\')">Sign Petition</button>';
        html += '<button class="btn get-details-btn" onclick="window.location =  \'details.html?id=\' + $(this).data(\'param\');" data-param="'+ result[i].petition_id +'">See Signatures</button>';
        html += '<span><button class="btn report-petition" onclick="reportPetition(' + result[i].petition_id + ');">Report Petition</button></span>';
        html += '</div>'
    }

    $('#petition-grid').append(html);
}


