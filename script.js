
        var tasks = {
            data: [],
            links: []
        };

        gantt.config.order_branch = true;
        gantt.config.order_branch_free = true;
        gantt.init("gantt_here");

        document.getElementById('csvFile').addEventListener('change', function(evt) {
            var file = evt.target.files[0];
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    var eventId = 1;
                    var skuTasks = {};
                    results.data.forEach(function(row) {
                        var startDate = gantt.date.str_to_date("%m/%d/%Y")(row['Start Date']);
                        var endDate = gantt.date.str_to_date("%m/%d/%Y")(row['End Date']);
                        if (!skuTasks[row['Item SKU']]) {
                            skuTasks[row['Item SKU']] = {
                                id: row['Item SKU'],
                                text: row['Item SKU'],
                                start_date: gantt.date.date_to_str("%Y-%m-%d")(startDate),
                                end_date: gantt.date.date_to_str("%Y-%m-%d")(endDate),
                                parent: 0,
                                open: true
                            };
                            tasks.data.push(skuTasks[row['Item SKU']]);
                        }
                        tasks.data.push({
                            id: eventId++,
                            text: row['Event ID'],
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

        document.getElementById('download').addEventListener('click', function() {
            var csvContent = Papa.unparse(tasks.data);
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "data.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
