import { csSel } from "./csSel.js";

new csSel({
    //option값은 줘도 되고 안 줘도 됩니다. 기본값은 모두 false에요.
    delete : false, //기존 select를 제거하지 않습니다.
    visible: true //기존 select를 가리지 않고 보이게 합니다. visible이 true여도, delete가 true면 visible은 false가 됩니다.
});