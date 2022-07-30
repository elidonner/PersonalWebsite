window.onload = function () {
    update_profile_height();
    console.log("editied");
};
window.addEventListener('resize', update_profile_height);

var animation = bodymovin.loadAnimation({
    container: document.getElementById("down-arrow"),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: "/static/animation/down_arrow.json"
})

function update_profile_height()
{   
    var size = document.getElementById('profile_pic').offsetWidth;
    let width = "height:".concat(size).concat("px");
    console.log(width);
    window.setTimeout(function() {
        document.getElementById('profile_pic').setAttribute("style", width);
    }, 200);
}