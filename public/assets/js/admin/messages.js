$(document).ready(function () {
    var table = $('#messages').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/admin/messages/getData",
            "type": "GET"
        },
        "columns": [
            { "data": "fullname" },
            { "data": "email" },
            { "data": "reason" },
            { "data": "message" },
            { "data": "message_date" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `<a href="#" title="Delete" class="delete-btn" data-id="${row.message_id}" style="color: red;"><i class="fa fa-trash" style="font-size: 18px;"></i></a>`;
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.message_id);
        },
        "initComplete": function (settings, json) {
            $(this).trigger('dt-init-complete');
        }
    });

    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        var row = $(this).closest('tr');

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/admin/messages/delete/' + id,
                    method: 'DELETE',
                    success: function (response) {
                        if (response.status === 'success') {
                            table.row(row).remove().draw(false);
                        } else {
                            // Handle unsuccessful deletion
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                            });
                        }
                    },
                    error: function () {
                        // Handle AJAX request error
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong with the request!',
                        });
                    }
                });
            }
        });
    });
});