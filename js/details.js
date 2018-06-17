$(document).ready(function() {
    var param = window.location.search.substring(1);
    var petition_id = param.split('=')[1];

    $('#no-data').hide();
    getPetition(petition_id);
    getSignatures(petition_id);
})

function getPetition(petition_id) {
    nebReadAnon('getPetition', [petition_id], function(result, error) {
        $('#error-info').hide();

        if (!result) {
            $('#error-info').show();
            $('#error-info').text('Error: ' + error);
        }

        else {
            var created_date = formatDate(result.created_date);
            var html = '';
            html += '<span class="petition-title">' + result.title + '</span>';
            if (result.description) {
                html += '<span class="petition-desc">' + result.description + '</span>';
            }
            html += '<span class="petition-data"><strong>Created by: </strong>' + result.created_by + '</span>';
            html += '<span class="petition-data"><strong>On: </strong>' + created_date + '</span>';
        }

        $('#petition-info').append(html);
    });
}

function getSignatures(petition_id) {
    nebReadAnon('getSignatures', [petition_id], function(result, error) {
        $('#error-info').hide();
        $('#no-data').hide();

        if (!result) {
            $('#error-info').show();
            $('#error-info').text('Error: ' + error);
        }

        if (result.length === 0) {
            $('#no-data').show();
        }

        else {
            var html = '<table><tbody><tr><th>#</th><th>Signed By</th><th>Signature Date</th></tr>';
            for (var i = 0; i < result.length; i++) {
                var signed_date = formatDate(result[i].date);
                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + result[i].address + '</td>';
                html += '<td>' + signed_date + '</td>'
                html += '</tr>'
            }
            html += '</tbody></table>'

            $('#petition-table').append(html);
        }
    });
}