export class csSel{
    constructor(option){
        this.$csSel = undefined;
        this.option = option ?? {};

        this.set_option();
        this.init();
    }//constructor
    ////////// METHOD //////////
    /* 옵션 정리 */
    set_option(){
        this.option.delete = this.option.delete ?? false;
        this.option.visible = this.option.visible ?? false;
        if(this.option.delete === true){
            this.option.visible = false;}
    }//set_option

    /* init */
    init(){
        this.get_all_dom();
        this.$csSel.forEach($select => {this.make_custom($select);});
    }//init

    /* get all selects */
    get_all_dom(){
        const all_dom = document.getElementsByClassName('csSel');
        this.$csSel = Array.from(all_dom);
    }//get_all_dom

    /* make custom select */
    make_custom($select){
        $select.tabIndex = -1;
        const options = Array.from($select);
        const $parent = $select.parentElement;
        const $wrap = this.make_wrap();
        
        //selected 추가
        const $selected = this.make_selected();
        $wrap.appendChild($selected);

        //list 추가
        const $list = this.make_list(options);
        $wrap.appendChild($list);

        //전체 추가
        $parent.insertBefore($wrap,$select.nextSibling);

        //사이즈 조정 및 selected 추가
        this.set_size($wrap);

        /* 개발자모드 관련 : select를 보이겠음? */
        if(!this.option.visible){this.not_visible($select);}

        /* 기존 select를 죽일것인가? */
        if(this.option.delete){
            this.delete_select($parent,$select);
        }


        //이벤트 달아주기
        this.addEvent($wrap);
    }//make_custom

    make_wrap(){
        const $wrap = document.createElement('DIV');
        $wrap.classList.add('csSel_wrap');
        return $wrap;
    }//wrap

    make_selected(){
        const $selected = document.createElement('DIV');
        $selected.classList.add('csSel_selected');
        $selected.tabIndex = 0;
        $selected.textContent = '';
        $selected.dataset.value = '';
        return $selected;
    }//make_selected

    make_list(options){
        const $list = document.createElement('UL');
        $list.classList.add('csSel_list');

        options.forEach(option =>{
            const $li = document.createElement('LI');
            $li.tabIndex = 0;
            $li.dataset.value = option.value ?? "";
            $li.textContent = option.textContent;
            $list.appendChild($li);
        });

        return $list;
    }//make_list

    set_size($wrap){
        const $list = Array.from($wrap.querySelector('.csSel_list').children);

        //가장 긴걸 찾고
        const longest = {len:0, li:$list[0]};
        $list.forEach($li => {
            if($li.textContent.length >= longest.len){
                longest.len = $li.textContent.length;
                longest.li = $li;
            }
        });

        //임시로 넣어서 바꿨다가
        const $selected = $wrap.querySelector('.csSel_selected');
        const longVal = longest.li.dataset.value;
        const longContent = longest.li.textContent;
        this.change_selected($selected,longVal,longContent);

        //사이즈만 고정하고
        const size = $selected.getBoundingClientRect().width;
        $wrap.style.minWidth = `${size}px`;

        //다시 0으로 바꿔주셈 ㅎㅎ
        const firstVal = $list[0].dataset.value;
        const firstContent = $list[0].textContent;
        this.change_selected($selected,firstVal,firstContent);
    }//set_size

    /* not_visible */
    not_visible($select){
        $select.style.position = "absolute";
        $select.style.opacity = 0;
        $select.style.overflow = "hidden";
        $select.style.width = 0;
        $select.style.height = 0;
    }//not_visible

    /* delete_select */
    delete_select($parent,$select){
        $parent.removeChild($select);
    }//delete_select

    /* add EventListener */
    addEvent($wrap){
        const $selected = $wrap.querySelector('.csSel_selected');
        const $csSel = $wrap.querySelector('.csSel_list');
        const $all_li = $csSel.children;

        /* selected 관련 이벤트 */
        $selected.addEventListener('keydown',(e)=>{
            switch(e.code){
                case "Escape" :
                    e.target.blur();
                    break;
                
                case "ArrowDown":
                case "ArrowUp":
                    this.get_last_selected($selected,$csSel,$all_li);
                    break;
            }//switch
        });

        $selected.addEventListener('focus', ()=>{this.get_last_selected($selected,$csSel,$all_li);});

        /* list 관련 이벤트 */
        $csSel.addEventListener('click',this.on_select);
        $csSel.addEventListener('keydown',(e)=>{
            const target = e.target;
            switch(e.code){
                case "Escape" :
                    target.blur();
                    break;

                case "ArrowDown" :
                    e.preventDefault();
                    const $next = target.nextElementSibling ?? $all_li[0];
                    $next.focus();
                    break;
                case "ArrowUp" :
                    e.preventDefault();
                    const $prev = target.previousElementSibling ?? $all_li[$all_li.length - 1];
                    $prev.focus();
                    break;
                case "Enter" :
                case "Space" :
                    this.on_select(e);
                    break;
            }//switch
        });
    }//addEvent

    //on select
    on_select = (e) =>{
        const target = e.target;
        if(target.tagName !== "LI"){return;}

        const val = target.dataset.value;
        const content = target.textContent;
        const $selected = target.parentElement.previousElementSibling;
        this.change_selected($selected,val,content);

        /* 기존 select dom 바꿔주기 */
        if(!this.option.delete){
            const $realSelect = target.parentElement.parentElement.previousElementSibling;
            const selectThis = $realSelect.querySelector(`[value="${val}"]`) ?? $realSelect.children[0];
            selectThis.selected = true;
        }//if

        //일정 시간뒤 포커싱을 해제한다.
        setTimeout(()=>{
            target.blur();
        }, 200);
    }//on_select

    /* 가장 마지막으로 선택됬던거 가져오기 */
    get_last_selected($selected,$csSel,$all_li){
        console.log('ㅋㅋ');
        const val = $selected.dataset.value;
        const lastSelected = $csSel.querySelector(`[data-value="${val}"]`) ?? $all_li[0];
        lastSelected.focus();
    }//get_last_selected

    /* custom select의 seleted 바꾸기 */
    change_selected($selected,val,content){
        $selected.dataset.value = val;
        $selected.textContent = content;
    }//change_selected
}//class-csSel