function displayResults(data) {
	$('tbody').empty();
	for(i=0; i<data.length; i++){
		$("tbody").append("<tr><td>" + data[i].title + +  + "<a href='" + data[i].link + "'></td></tr>");
	}
}

 $.getJSON("/all", (data) => {
	 // Call our function to generate a table body
  displayResults(data);
})
