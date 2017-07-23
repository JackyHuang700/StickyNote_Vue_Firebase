<template>
    <div>
        <transition-group name="fade" tag="ul">
            <li class="postit" v-for="(postit, index) in postits" :key="postit" :style="PostitCss(postit)" @mousedown="SelectId($event, index)">
                <div class="text">
                    {{postit.text}}
                </div>
                <div class="colorPalettes">
                    <div class="block" v-for="c in colorList" :key="c" :style="{'background-color': c.color}" @click="SetPostitColor(c, index)">
                    </div>
                    <i class="fa fa-pencil" @click="EditText(index)"></i>
                    <i class="fa fa-trash-o" @click="DeletePostit(index)"></i>
                </div>
            </li>
        </transition-group>


        <!-- 資料測試 -->
        <ul class="dataList">
            <li class="addPost" @click="AddPostit">Add PostIt +</li>
            <li v-for="postit in postits" :key="postit">
                <input type="text" v-model="postit.text">
                <input type="text" v-model="postit.color">
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                colorList: [{
                    name: "yellow",
                    color: "#FFEB67"
                }, {
                    name: "blue",
                    color: "#A5D8D6"
                }, {
                    name: "red",
                    color: "#EF898C"
                }, {
                    name: "green",
                    color: "#CBE196"
                }],
                //第一章便利貼資料
                postits: [{
                    text: "都市更新",
                    color: "yellow",
                    pos: {
                        x: 20,
                        y: 0
                    }
                }, ],
                //目前操作的物件
                nowId: -1,
                //位移
                mousePos: {

                    x: 0,
                    y: 0,
                },
                //偏移量
                startMousePos: {
                    x: 0,
                    y: 0,
                }
            }
        },
        methods: {
            PostitCss(postit) {

                var textLen = postit.text.length;
                var random = Math.random() * 10;
                return {
                    backgroundColor: this.colorList.find(c => c.name === postit.color).color,
                    fontSize: `calc(250px/${textLen} - 24px)`,
                    left: `${postit.pos.x}px`,
                    top: `${postit.pos.y}px`,
                };
            },

            //選擇物件
            SelectId(event, index) {
                // this.nowId = index;
                //指定選擇便利貼，並紀錄開始位移（滑鼠與便利貼左上距離）
                this.startMousePos = {
                    x: event.offsetX,
                    y: event.offsetY,
                };
                //防止點選或是編輯有跳動
                let isBlock = event.srcElement.classList.contains('block');
                let isFa = event.srcElement.classList.contains('fa');
                if (isBlock || isFa) {
                    this.nowId = -1;
                } else {
                    this.nowId = index;

                }

            },
            //新增便利貼
            AddPostit(event) {
                let random = (Math.random() * 100) + 200;
                window.database.push({
                    text: "文字",
                    color: "yellow",
                    pos: {
                        x: random,
                        y: random,
                    }
                });
            },

            //改變顏色
            SetPostitColor(c, index) {
                this.postits[index].color = this.colorList.find(a => a.name === c.name).name;
                window.database.child(index).set(this.postits[index]);
            },
            //編輯文字
            EditText(index) {

                let text = prompt("輸入內容：", this.postits[index].text);
                if (text) {
                    window.database.child(index).child("text").set(text);
                }
            },
            //刪除便利貼
            DeletePostit(index) {
                window.database.child(index).remove();
            },
        },
        computed: {


        },
        watch: {
            //更新位置
            postits: {
                handler: (val, oldVal) => {
                    if (this.nowId !== -1) {
                        // if (window.database.child(this.nowId)) {

                        // // window.database.child(this.nowId).set(val[0]);
                        //}

                    }
                },
                deep: true
            },
            mousePos: function (newPos, oldPos) {
                if (this.nowId !== -1) {
                    let postits = this.postits[this.nowId];
                    //滑鼠更新時，動態指定當下便利貼位置（新位置-開始偏移）
                    postits.pos.x = newPos.x - this.startMousePos.x;
                    postits.pos.y = newPos.y - this.startMousePos.y;

                   
                }
            }
        }
    }
</script>

<style lang="scss">
    /*色票*/

    $colorYellow: #FFEB67;
    $colorBlue: #A5D8D6;
    $colorRed: #EF898C;
    $colorGreen: #CBE196;
    $colorBlack: #3E3A39;

    *,
    *:after,
    *:before {
        // border: solid 1px;
    }


    * {
        font-family: 'Noto Sans TC', sans-serif;
        color: #44403F;
    }

    html,
    body {
        background-color: $colorBlack;
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
        overflow: hidden;
        position: relative;
    }

    body {
        background: linear-gradient(#2B2828 0%, #2B2828 96%, #333 96%);
        background-size: 40px 40px;
    }
    /*色卡.預設值*/

    .postit {
        height: 240px;
        width: 240px;
        font-size: calc(250px/4 - 24px);
        display: flex;
        justify-content: center;
        position: absolute;
        align-items: center;
        letter-spacing: 10px;
        font-weight: 500;
        background-color: $colorYellow;
        transition: background-color .5s;
        box-shadow: 15px 10px 40px rgba(black, 0.4);
        cursor: pointer;
        .text {
            color: #444; //防止跳動
            user-select: none;
            pointer-events: none;
            -webkit-user-select: none;
        }
        /*調色盤*/
        .colorPalettes {
            display: flex;
            position: absolute;
            left: 0px;
            bottom: -50px;
            opacity: 0;
            transition-duration: .5s;
            .block {
                height: 30px;
                width: 30px;
                margin-right: 10px;
                border: solid 1px;
            }

            .fa-pencil,
            .fa-trash-o {
                color: white;
                font-size: 30px;
                transition-duration: .5s;
                opacity: 0;

                &:hover {
                    // color: #ddd;
                    color: red;
                }
            }
        }
        /*白色框線*/
        &::before {
            content: '';
            border: rgba(white, .6) 1px solid;
            width: calc(100% + 24px);
            height: calc(100% + 24px);
            display: block;
            position: absolute;
            opacity: 0;
            pointer-events: none;
            transition-duration: .8s; // pointer-events: none;
        }

        &:hover {
            &::before {
                opacity: 1;
                width: calc(100% + 30px);
                height: calc(100% + 30px);
            }

            .colorPalettes {
                opacity: 1;
            }

            .fa-pencil,
            .fa-trash-o {
                opacity: 1;
            }
        }
    }
    /*資料測試區*/

    .dataList {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 30%;
        padding: 10px;
        border: rgba(white, 1) 1px solid;
        overflow-y: scroll;
        min-width: 200px;
        max-width: 300px;
        width: 20%;
        height: 60%;
        li {
            padding: 5px 10px;
            min-height: 30px;
            border-bottom: rgba(white, .3) 1px solid;
        }

        .addPost {
            color: white;
            cursor: pointer;
            transition-duration: .5s;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
                color: black;
                background-color: rgba(white, .8);
            }
        }
    }


    .fade-enter-active,
    .fade-leave-active {
        transition: .5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        transform: scale(0);
    }
</style>