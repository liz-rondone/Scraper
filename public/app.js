function displayResults(data) {
	$('tbody').empty();
	for(i=0; i<data.length; i++){
		$("tbody").append("<tr><td>" + data[i].title + +  + "<a href='" + data[i].link + "'></td></tr>");
	}
}

 $.getJSON("/all", function(data) {
	 // Call our function to generate a table body
  displayResults(data);
})



<div class="col-md-4">
	<a href="https://stackoverflow.com/" target="_blank"><i class="fa fa-stack-overflow"></i></a>
	<p><a href="https://stackoverflow.com/" class="gray-txt" target="_blank">Stack Overflow</a></p>
</div>