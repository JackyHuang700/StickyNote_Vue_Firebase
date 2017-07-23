// [週四寫程式系列] - 來做換色與快速整理的便利貼牆吧！
import Vue from 'vue'
import bossThursdaySVG from './components/boss_Thursday_SVG.vue';
import './scss/myscss.scss';



// Initialize Firebase
var config = {
    apiKey: "AIzaSyC85J6FkT2vKxk4R0859n9nMqGgORORfFc",
    authDomain: "vue-postit.firebaseapp.com",
    databaseURL: "https://vue-postit.firebaseio.com",
    projectId: "vue-postit",
    storageBucket: "vue-postit.appspot.com",
    messagingSenderId: "742715602518"
};
firebase.initializeApp(config);

var database = firebase.database().ref('postits');
window.database = database;

database.on('value', (snapshot) => {
    console.log(snapshot.val())
    app.$children[0].postits = snapshot.val();
});

Vue.config.debug = true;
var app = new Vue({
    el: "#app",
    render: c => c(bossThursdaySVG),
});


window.ontouchmove = 
window.onmousemove = (event) => {
    // console.log(`mousemove`)
    // console.log(`event`, event)
    // debugger;
    //滑鼠移動時，將最新位置記錄到vue中
    let mousePos = [event].map(c => ({
        x: c.pageX,
        y: c.pageY,
    }))[0];
    app.$children[0].mousePos = mousePos;
}



window.ontouchend = 
window.onmouseup = (event) => {
    // console.log(`mouseleave`);

    //更新DB
    let nowId = app.$children[0].nowId;
    let aa = app.$children[0].postits[nowId];
    window.database.child(nowId).set(aa);

    //不指定物件
    app.$children[0].nowId = -1;

}