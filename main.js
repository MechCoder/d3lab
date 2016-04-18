var scatter_plot = function(x_coord, y_coord, x_label, y_label, car_names, x_min, x_max, y_min, y_max) {

    var pad = 20;
    var left_pad = 100;
    var w = 500;
    var h = 300;
    var svg = d3.select('svg')
      .attr('width', w)
      .attr('height', h)

    var xScale = d3.scale.linear().domain([0, y_max+10]).range([pad, w-pad]);
    var yScale = d3.scale.linear().domain([x_max+10, 0]).range([0, h - pad*2]);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    svg.selectAll("g.axis").remove();
    svg.selectAll("text.axislabel").remove();
    //svg.select("g.x.axis").remove();

    svg.append('g')
      .attr("class", "axis")
      .attr("transform", "translate(0, "+ (h-2*pad) +")")
      .style("text-anchor", "middle")
      .call(xAxis);

    svg.append('g')
      .attr("class", "axis")
      .attr("transform", "translate("+(left_pad-3*pad)+", 0)")
      .style("text-anchor", "middle")
      .call(yAxis);

    svg.append('text')
      .attr("class", "axislabel")
      .attr("text-anchor", "end")
      .attr("x", w)
      .attr("y", 290)
      .text(y_label);

    svg.append('text')
      .attr("class", "axislabel")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text(x_label);

    var xMap = function(d) {
        return xScale(d);
    }

    var yMap = function(d) {
        return yScale(d);
    }

    var data = [];
    for (var i = 0; i < x_coord.length; i++) {
        data.push({'x': y_coord[i], 'y': x_coord[i], 'z': car_names[i]})
    }

    var MouseOver = function (d) {
        $('#hovered').text(d.z);
    }
    var circle = svg.selectAll("circle")
      .data(data);

    circle.exit().remove();

    circle.enter().append("circle")
      .attr("r", 3.5);

    circle
      .attr("cx", function(d) { return xMap(d.x); })
      .attr("cy", function(d) { return yMap(d.y); })
      .on("mouseover", MouseOver);

}

$(document).ready(function() {

    var curr_data = {};

    d3.csv("car.csv", function(error, data) {
        headers = d3.keys(data[0]);

        var select_x = $('#sel-x');
        var select_y = $('#sel-y');

       for (var i = 0; i < headers.length; i++) {
            var curr_name = headers[i];
            if (curr_name != 'name' && curr_name != 'origin') {
                if (curr_name != 'mpg') {
                    $('<option></option>')
                      .val(curr_name)
                      .text(curr_name)
                      .appendTo(select_x);
                }
                if (curr_name != 'displacement') {
                    $('<option></option>')
                      .val(curr_name)
                      .text(curr_name)
                      .appendTo(select_y);
                }
                curr_data[headers[i]] = [];
           }
        }

        var car_names = [];
        curr_headers = d3.keys(curr_data);
        data.forEach(function(d) {
            for (var i = 0; i < curr_headers.length; i++) {
                var c_h = curr_headers[i];
                curr_data[c_h].push(+d[c_h]);
            }
            car_names.push(d['name']);
        });

        var x_label = $('#sel-x').val();
        var y_label = $('#sel-y').val();
        var x_coord = curr_data[x_label];
        var y_coord = curr_data[y_label];
        var x_min = Math.min.apply(Math, x_coord);
        var x_max = Math.max.apply(Math, x_coord);
        var y_min = Math.min.apply(Math, y_coord);
        var y_max = Math.max.apply(Math, y_coord);
        scatter_plot(
            x_coord, y_coord, x_label, y_label, car_names,
            x_min, x_max, y_min, y_max);

        $('#sel-x').click(function() {
            var x_label = $('#sel-x').val();
            var y_label = $('#sel-y').val();
            var x_coord = curr_data[x_label];
            var y_coord = curr_data[y_label];
            var x_min = Math.min.apply(Math, x_coord);
            var x_max = Math.max.apply(Math, x_coord);
            var y_min = Math.min.apply(Math, y_coord);
            var y_max = Math.max.apply(Math, y_coord);
            scatter_plot(x_coord, y_coord, x_label, y_label, car_names,
                x_min, x_max, y_min, y_max);
        });

        $('#sel-y').click(function() {
            var x_label = $('#sel-x').val();
            var y_label = $('#sel-y').val();
            var x_coord = curr_data[x_label];
            var y_coord = curr_data[y_label];
            var x_min = Math.min.apply(Math, x_coord);
            var x_max = Math.max.apply(Math, x_coord);
            var y_min = Math.min.apply(Math, y_coord);
            var y_max = Math.max.apply(Math, y_coord);
            scatter_plot(x_coord, y_coord, x_label, y_label, car_names,
                x_min, x_max, y_min, y_max);
        });

        $('#update').on('click', function() {
            var mpg_min = $('#mpg-min').val();
            var mpg_max = $('#mpg-max').val();
            var x_label = $('#sel-x').val();
            var y_label = $('#sel-y').val();
            var x_coord = curr_data[x_label];
            var y_coord = curr_data[y_label];
            var filtered_x = [];
            var filtered_y = [];
            var filtered_cars = [];
            var mpg_data = curr_data['mpg']
            var x_min = Math.min.apply(Math, x_coord);
            var x_max = Math.max.apply(Math, x_coord);
            var y_min = Math.min.apply(Math, y_coord);
            var y_max = Math.max.apply(Math, y_coord);
            for (var i = 0; i < x_coord.length; i++) {
                if (mpg_data[i] <= mpg_max && mpg_data[i] >= mpg_min) {
                    filtered_x.push(x_coord[i])
                    filtered_y.push(y_coord[i])
                    filtered_cars.push(car_names[i])
                }
            }
            scatter_plot(filtered_x, filtered_y, x_label, y_label, filtered_cars,
                x_min, x_max, y_min, y_max);
        });
    })
});
