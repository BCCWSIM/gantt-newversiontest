        gantt.config.order_branch = true;
        gantt.config.order_branch_free = true;
        gantt.init("gantt_here");

        document.getElementById('csvFile').addEventListener('change', function(evt) {
            var file = evt.target.files[0];
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    var tasks = {
                        data: [],
                        links: []
                    };
                    var eventId = 1;
                    results.data.forEach(function(row) {
                        var startDate = new Date(row['Start Date']);
                        var endDate = new Date(row['End Date']);
                        tasks.data.push({
                            id: eventId++,
                            text: row['Item SKU'],
                            start_date: gantt.date.date_to_str("%Y-%m-%d")(startDate),
                            end_date: gantt.date.date_to_str("%Y-%m-%d")(endDate),
                            parent: row['Item SKU'],
                            render: "split"
                        });
                    });
                    gantt.parse(tasks);
                }
            });
        }, false);
