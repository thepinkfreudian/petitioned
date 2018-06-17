var contract_address = 'n1iQ9ih2ApHiH26gRyWrRV1NXBxXxiJKMTA';
var is_mainnet = true;
var nebulas_domain = (is_mainnet ? 'https://mainnet.nebulas.io' : 'https://testnet.nebulas.io');

var gas_price = 1000000;
var gas_limit = 200000;

/* if (typeof(webExtensionWallet) === "undefined") {
    alert('Looks like you don\'t have a wallet installed. You can get the extension from the link in the footer.');
} */

function formatDate(date_string) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var raw_date = new Date(date_string);
    var month = months[raw_date.getMonth() - 1];
    var day = raw_date.getDate();
    var year = raw_date.getFullYear();

    return month + ' ' + day + ', ' + year;
}

function formatAddress(address) {
    address = address.trim();
    var prefix = address.substring(0, 2);
    var suffix = address.substring(address.length - 3);
    return prefix + "..." + suffix;
}




