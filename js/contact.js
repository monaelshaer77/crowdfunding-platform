function localContent(elementId,fileName)
{
    fetch(fileName)
    .then(response=>response.text())
    .then(data=>{
        document.getElementById(elementId).innerHTML=data;
    })
    .catch(err=>console.log('Error loading content'));
}
localContent("header-container",'../components/header.html');
localContent("footer-conteriner","../components/footer.html");