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
    }
}//class-csSel