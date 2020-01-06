function deleteCategory(id){
    let cf = confirm('You want to delete Item?');
    if(cf == true){
        window.location.href = "/admin/category/delete/" + id;
    }
} 