$(document).ready(function(){

    var $list = $('.todo-list');
    var $clonelist = $('#clone-list');
    var $input = $('.todo-input');
    var $container = $('#container_list');
    var completeNum=0;

    $container.find('button').on('click', function (event) {
        console.log("btn cont1 event", event)
    });

    $('#add_to_container').click(function(event){
        var $containerNrOfChildren = $container.children().length;
        // Create a clone of element with id ddl_1:
        var $clone = document.querySelector('.formcontainer').cloneNode(true);
        // Change the id attribute of the newly created element:
        $clone.setAttribute('class', 'formcontainer draggable');
        //$clone.setAttribute('id', 'nb-'+containerNrOfChildren)
        var string = ($clone).outerHTML;
        $container.append(
            '<div class="col-md-4">'+string+'</div>');
        var draggableElements = document.getElementsByClassName("draggable");

        for(var i = 0; i < draggableElements.length; i++){
            dragElement(draggableElements[i]);
        }
    });

    //Methods for Adding
    function addTodo(text){
        //create item
        var $li = $('<li class="li-item ui-state-default">');

        var $dragable = $('<span class="dragable"></span>');
        var $checkbox = $('<span class="checkbox"></span>');
        var $text = $('<span class="text">').text(text);
        var $remove = $('<span class="remove"></span>');
        $li.append($dragable).append($checkbox).append($text).append($remove);
        //$li.append($text);

        //add it to the list
        $list.append($li);

        //ready for DnD
        $li.ready(initListItem($li,$checkbox,$remove));
    }


    //Methods for send
    $('.todo-form').bind('submit', function(e){
        //stop the default behavior
        e.preventDefault();

        //get the text
        var text = $input.val();
        if(text){

            //add
            addTodo(text);

            //delete the value
            $input.val('');
        }else{
            $('.container').animate({ left: "-5px" }, 100).animate({ left: "20px" }, 100)
                .animate({ left: "-10px" }, 100).animate({ left: "10px" }, 100)
                .animate({ left: "0px" }, 100);
        }
    });

    //Sortable DnD
    $('.todo-list').sortable({
        axis:'y',
        handle: ".dragable",
        revert: 100,
        scroll: false,
        placeholder:"sortable-placeholder",
        cursor:'move',
        start:function(event,ui){
            ui.helper.addClass("exclude-me");
            $(".todo-list .li-item:not(.exclude-me)").css("visibility", "hidden");
            ui.helper.data("clone").hide();
            $(".clone-list .li-item").css("visibility", "visible");
        },
        stop:function(event,ui){
            $(".todo-list .li-item.exclude-me").each(function() {
                var item = $(this);
                var clone = item.data("clone");
                var position = item.position();

                clone.css("left", position.left);
                clone.css("top", position.top);
                clone.show();

                item.removeClass("exclude-me");
            });


            $(".todo-list .li-item").css("visibility", "visible");
            $(".clone-list .li-item").css("visibility", "hidden");
        },
        change: function(e, ui) {
            $(".todo-list .li-item:not(.exclude-me)").each(function() {
                var item = $(this);
                var clone = item.data("clone");
                clone.stop(true, false);
                var position = item.position();
                clone.css({
                    left: position.left,
                    top: position.top
                });
            });
        }
    });

    //Button Interactions
    $('.my-func').hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');
    });

    $('h1').click(function(){
        var num = $('.todo-list .li-item').length;
        var numComp = $('.todo-list .complete').length;
        //alert(numComp);
        if(num==numComp){
            if(num){

                $('.li-item').each(function(){
                    $(this).removeClass('complete');
                });
                $('footer').removeClass('active').prop("disabled", true);
                completeNum = 0;
            }
        }else{
            if(num){
                $('.li-item').each(function(){

                    $(this).addClass('complete');
                    completeNum++;
                });
                $('footer').addClass('active').prop("disabled", false);
            }
        }


    });
    $('h1').on('mousedown',function(){
        $(this).addClass('click');
    });
    $('h1').on('mouseup',function(){
        $(this).removeClass('click');
    });

    $('#delete').click(function(){
        $('.complete').each(function(){
            $(this).remove();

        });

        completeNum=0;
        $('footer').removeClass('active').prop("disabled", true);
        $('.my-list').height(272);

        $(".todo-list .li-item").each(function() {
            var item = $(this);
            var clone = item.data("clone");
            var position = item.position();

            clone.css("left", position.left);
            clone.css("top", position.top);
        });
        setTimeout(function(){
            $('#my-list').perfectScrollbar('update');},300);
    });
    $('.todo-input').focus(function(){
        $('.icn-input').fadeOut('fast');
        $('.todo-add').removeClass('not-focused');//.prop("disabled", false);
    }).blur(function(){
        $('.icn-input').fadeIn('fast');
        var tmpText = $('.todo-input').val();
        if(!tmpText && !$('.todo-add').hasClass('not-focused')){
            $('.todo-add').addClass('not-focused');//.prop("disabled", true);
        }
    });

    $('.todo-add').hover(function(){
        $(this).addClass('hover');
    },function(){
        $(this).removeClass('hover');                  
    });

    $('.todo-add').click(function(){
        $(this).addClass('click');
        if(!$('.todo-input').focus()){
            $(this).addClass('not-focused');//.prop("disabled", true);
        }
        setTimeout(function(){
            $('.todo-add').addClass('clickdone');

        },400);
        setTimeout(function(){
            $('.todo-add').removeClass('click');
            $('.todo-add').removeClass('clickdone');

        },800);
    });

    //Functioncs
    function initListItem(li, checkbox, remove){
        var item = li;
        var itemClone= item.clone();
        item.data('clone',itemClone);
        var position = item.position();
        //alert(position.top);
        itemClone.css({
            left:position.left,
            top:position.top,
            visibility:'hidden'
        }).addClass('clone');
        $('#clone-list').append(itemClone);
        //Complete
        checkbox.click(function(){
            if(li.hasClass('complete')){
                li.removeClass('complete');
                itemClone.removeClass('complete');
                completeNum--;
                if(!completeNum){
                    $('footer').removeClass('active').prop("disabled", true);
                    $('.my-list').height(272);
                }
            }else{
                li.addClass('complete');
                itemClone.addClass('complete');
                completeNum++;
                if(completeNum){
                    $('footer').addClass('active').prop("disabled", false);
                    $('.my-list').height(224);
                }
            }
        });

        //remove
        remove.click(function(){
            if(li.hasClass('complete')){
                completeNum--;
                if(!completeNum){
                    $('footer').removeClass('active').prop("disabled", true);
                    $('.my-list').height(272);
                }
            }
            li.remove();
            itemClone.remove();



            $(".todo-list .li-item").each(function() {
                var item = $(this);
                var clone = item.data("clone");
                var position = item.position();

                clone.css("left", position.left);
                clone.css("top", position.top);
            });
            $('#my-list').perfectScrollbar('update');
        });

        $('#my-list').perfectScrollbar('update');
        $(".todo-list").sortable('refresh');
    }

    //init
    $('#my-list').perfectScrollbar();  
    $('.li-item').each(function(){
        var checkbox = $(this).children('.checkbox');
        var remove =$(this).children('.remove');
        initListItem($(this), checkbox, remove);
    });


    // Make the DIV element draggable:
    var draggableElements = document.getElementsByClassName("draggable");

    for(var i = 0; i < draggableElements.length; i++){
        dragElement(draggableElements[i]);
    }

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        //if (document.getElementById(elmnt.id + "header")) {
        if (document.getElementById("my-list")) {
            // if present, the header is where you move the DIV from:
            //document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            document.getElementById("my-list").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.zIndex = "0";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
