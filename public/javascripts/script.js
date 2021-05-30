function search(id1, id2) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(id1);
    filter = input.value.toUpperCase();
    table = document.getElementById(id2);
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}