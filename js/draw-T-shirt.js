let buttonArea = {};


function changeColor() {
    let _color = $ ("#selectColor").val ();
    $ ("#lettering").css ("background-color", _color);
    $ ("#templateTshort").css ("background-color", _color);
}

function selectLettering() {
    $ ("#lettering").html (nl2br ($ ("#inputLettering").val ()));
}

function changeColorText() {
    let _color = $ ("#selectColorText").val ();
    $ ("#lettering").css ("color", _color);
    $ ("#inputLettering").css ("color", _color);
}


function focusInputLettering() {
    $ ("#inputLettering").focus ();
}

function changeTestSize() {
    let _size = $ ("#textSeze").val () + 'pt';
    $ ("#lettering").css ("font-size", _size);
    $ ("#inputLettering").css ("font-size", _size);
}


function changeFont() {
    let _font = $ ("#myFont").val ();
    $ ("#lettering").css ("fontFamily", _font);
    $ ("#inputLettering").css ("fontFamily", _font);

}

function nl2br(str) {	// Inserts HTML line breaks before all newlines in a string
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    return str.replace (/([^>])\n/g, '$1<br/>');
}

// ---- Игры с ООП Bagin --------------
class AButton {
    constructor(idButton = AButton.getDefaultIdButton ()) {
        this._state = false;        // Флаг состояния кнопки нажата/нет
        this.idButton = idButton;   // id кнопки
        this._dependent = [];       // Зависимые кнопки, их будем выключать при включении текущей
        this._parametr = [];        // Параметры присвоаемые элементу по нажатию кнопки
    }

    static getDefaultIdButton() {
        let str = `Error ! Объект пустой, так как при создании не указан idButton`;
        console.error (str);
        return `Error !`;
    }

    get state() {
        return this._state;
    }

    in_state(val_state) {  //  Тут хотел установить сеттер 'set state' но пришлось обїявлять функцию. Нужно узнать почему.
        if (val_state !== undefined && typeof val_state === 'boolean') {
            this._state = val_state;
            this.draw ();
        } else {
            console.error ("Ошибка ! Требуется передать True или False.");
        }
    }

    press() {
        this._state = !this._state;
        this.draw ();
    }

    draw() {
        let _element = $ (`#${this.idButton}`);
        if (this._state) {
            _element.css ({ "backgroundColor": "#5a5a5a" });
            // console.log (`Зависимые элементы для ${this.idButton} - ${this._dependent}`);
            for ( let offen of this._dependent ) {
                if (buttonArea[offen] != undefined) {
                    if (buttonArea[offen].state) {
                        buttonArea[offen].in_state (false);  // Выключим зависимые кнопки
                    }
                } else console.error (`Ошибка ! Нет Кнопки с Id "${offen}", по этому не могу её выключить.:(`);
            }
        } else {
            _element.css ({ "backgroundColor": "" });
        }
        this.setParameter ();
    }

    // Список зависимых кнопок
    dependent(dependent) {
        if (dependent.length < 1) {
            this.dependent = []; // Очищаем список зависимых кнопок
        } else {
            this._dependent = this._dependent.concat (dependent); // Дополняем список зависимых кнопок
        }
    }

    // принимаем Взводимые параметры пример: (['font-weight', 'normal', 'bold'])
    initParametr(paramArea) {
        if (paramArea.length < 3) {
            if (paramArea.length > 0) {
                console.error (`Ошибка ! Ожидаю 3 параметра.`);
            }
            this._parametr = []; // Параметры не переданы
        } else {
            this._parametr = paramArea;
            // console.log(this._parametr);
        }
    }

    setParameter() {
        if (this._parametr.length > 0) {
            const _param = this._parametr[0], _defauld = this._parametr[1], _custom = this._parametr[2];
            if (this._state) {
                $ ('#inputLettering').css (_param, _custom);
                $ ("#lettering").css (_param, _custom);
            } else {
                $ ('#inputLettering').css (_param, _defauld);
                $ ("#lettering").css (_param, _defauld);
            }
        }
    }


}

function pressButton(idButton) {
    // console.log(`${idButton} ${buttonArea[idButton].state}`);
    buttonArea[idButton].press ();
    // console.log(`${idButton} ${buttonArea[idButton].state}`);
}

function createButtonArea() {
    for ( let nButton of $ ('.panelFontType .buttonFontType') ) {
        buttonArea[nButton.id] = new AButton (nButton.id);
        switch (nButton.id) { // Определяем зависимые кнопки, их будем выключать при включении текущей
            case 'FontType_B' : {
                buttonArea[nButton.id].initParametr (['font-weight', 'normal', 'bold']);
                break;
            }
            case 'FontType_I' : {
                buttonArea[nButton.id].initParametr (['font-style', 'normal', 'italic']);
                break;
            }
            case 'FontType_U' : {
                buttonArea[nButton.id].initParametr (['text-decoration', 'none', 'underline']);
                buttonArea[nButton.id].dependent (['FontType_not']);
                break;
            }
            case 'FontType_not': {
                buttonArea[nButton.id].initParametr (['text-decoration', 'none', 'line-through red']);
                buttonArea[nButton.id].dependent (['FontType_U']);
                break;
            }
            case 'textAlign_L': {
                buttonArea[nButton.id].initParametr (['text-align', 'center', 'left']);
                buttonArea[nButton.id].dependent (['textAlign_C', 'textAlign_R']);
                break;
            }
            case 'textAlign_C': {
                buttonArea[nButton.id].initParametr (['text-align', 'left', 'center']);
                buttonArea[nButton.id].dependent (['textAlign_L', 'textAlign_R']);
                break;
            }
            case 'textAlign_R': {
                buttonArea[nButton.id].initParametr (['text-align', 'center', 'right']);
                buttonArea[nButton.id].dependent (['textAlign_L', 'textAlign_C']);
                break;
            }
            default : {
                let dependent = [];
                buttonArea[nButton.id].dependent (dependent);
                break;
            }
        }

        $ (`#${nButton.id}`).attr ("onclick", "pressButton(this.id)");

    }
}

// ---- Игры с ООП End --------------

$ (document).ready (function () {
    createButtonArea (); // ---- Игры с ООП
    let countPress = 0;
    buttonArea['textAlign_C'].press ();

    changeColor ();

    // Drag-and-Drop Text begin
    let lettering = document.getElementById ('inputLettering');
    lettering.onmousedown = function (e) {
        let coords = getCoords (lettering);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;
        lettering.style.position = 'absolute';
        document.body.appendChild (lettering);
        moveAt (e);
        lettering.style.zIndex = 1000; // над другими элементами

        function moveAt(e) {
            lettering.style.left = e.pageX - shiftX + 'px';
            lettering.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function (e) {
            moveAt (e);
        };

        lettering.onmouseup = function () {
            document.onmousemove = null;
            lettering.onmouseup = null;
        }
    };

    lettering.ondragstart = function () {
        return false;
    };

    function getCoords(elem) {   // кроме IE8-
        let box = elem.getBoundingClientRect ();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        }
    }

    // Drag-and-Drop Text end
    function countPres_0() {
        countPress = 0;
    }

    // Drag-and-Drop Pic Start
    $ ('.draggable')
    // .dblclick ( Отловить dblclick при наличии mousedown не удаётся. считаем countPress ;)
    //     function (e) {
    //         let dblclickElement = e.target;
    //         dblclickElement.classList.remove ('draggable');
    //         dblclickElement.classList.add ('sizegable');
    //     }
    // )
        .mousedown (function (e) {
            countPress++;
            setTimeout (countPres_0, 500);
            let dragElement = e.target;
            if (countPress > 1) {
                dragElement.classList.toggle ('sizegable');
            } else if (dragElement.classList.contains ('sizegable')) {
                // return;
            } else {
                if (!dragElement.classList.contains ('draggable')) return;
                let shiftX, shiftY; // coords,
                startDrag (e.clientX, e.clientY);
                document.onmousemove = function (e) {
                    moveAt (e.clientX, e.clientY);
                };
                dragElement.onmouseup = function () {
                    finishDrag ();
                };

                // -------------------------
                function startDrag(clientX, clientY) {

                    shiftX = clientX - dragElement.getBoundingClientRect ().left;
                    shiftY = clientY - dragElement.getBoundingClientRect ().top;

                    dragElement.style.position = 'fixed';

                    document.body.appendChild (dragElement);

                    moveAt (clientX, clientY);
                }

                function finishDrag() {
                    // конец переноса,
                    //

                    // проверяем вынесение за пределы main
                    let divMain = $('#main');
                    let positionMain = divMain.offset ();
                    let _top = positionMain['top'], _left = positionMain['left'];
                    let _bottop = _top + divMain.height (), _right = _left + divMain.width ();
                    let _x = dragElement.offsetLeft, _y = dragElement.offsetTop;
                    if (_x < _left || _x > _right || _y < _top || _y > _bottop) {       // Вне поля Main
                        console.log ('Out of Main');
                        // убираем позиционирование
                        // вставляем а imgBank
                        //dragElement.css({'top': '', 'left': '', 'position': ''});
                        // dragElement.css({'top': 'auto'});
                        // dragElement.style.position = 'fixed';
                        dragElement.style.left = 'auto';
                        dragElement.style.top  = 'auto';
                        dragElement.style.position = 'static';
                        document.getElementById("imgBank").appendChild(dragElement);
                        // $('#imgBank').appendChild (dragElement);

                    } else {                                                            // Внутри поля Main
                        // перейти от fixed к absolute-координатам
                        dragElement.style.top = parseInt (dragElement.style.top) + pageYOffset + 'px';
                        dragElement.style.position = 'absolute';
                    }
                    document.onmousemove = null;
                    dragElement.onmouseup = null;
                }

                function moveAt(clientX, clientY) {
                    // новые координаты
                    let newX = clientX - shiftX;
                    let newY = clientY - shiftY;
                    // ------- обработаем вынос за нижнюю границу окна ------
                    // новая нижняя граница элемента
                    let newBottom = newY + dragElement.offsetHeight;
                    // если новая нижняя граница вылезает вовне окна - проскроллим его
                    if (newBottom > document.documentElement.clientHeight) {
                        // координата нижней границы документа относительно окна
                        let docBottom = document.documentElement.getBoundingClientRect ().bottom;
                        // scrollBy, если его не ограничить - может заскроллить за текущую границу документа
                        // обычно скроллим на 10px
                        // но если расстояние от newBottom до docBottom меньше, то меньше
                        let scrollY = Math.min (docBottom - newBottom, 10);
                        // ошибки округления при полностью прокрученной странице
                        // могут привести к отрицательному scrollY, что будет означать прокрутку вверх
                        // поправим эту ошибку
                        if (scrollY < 0) scrollY = 0;
                        window.scrollBy (0, scrollY);
                        // резким движением мыши элемент можно сдвинуть сильно вниз
                        // если он вышел за нижнюю границу документа -
                        // передвигаем на максимально возможную нижнюю позицию внутри документа
                        newY = Math.min (newY, document.documentElement.clientHeight - dragElement.offsetHeight);
                    }
                    // ------- обработаем вынос за верхнюю границу окна ------
                    if (newY < 0) {
                        // проскроллим вверх на 10px, либо меньше, если мы и так в самом верху
                        let scrollY = Math.min (-newY, 10);
                        if (scrollY < 0) scrollY = 0; // поправим ошибку округления

                        window.scrollBy (0, -scrollY);
                        // при резком движении мыши элемент мог "вылететь" сильно вверх, поправим его
                        newY = Math.max (newY, 0);
                    }
                    // зажать в границах экрана по горизонтали
                    // здесь прокрутки нет, всё просто
                    if (newX < 0) newX = 0;
                    if (newX > document.documentElement.clientWidth - dragElement.offsetHeight) {
                        newX = document.documentElement.clientWidth - dragElement.offsetHeight;
                    }
                    dragElement.style.left = newX + 'px';
                    dragElement.style.top = newY + 'px';
                }

                // отменим действие по умолчанию на mousedown (выделение текста, оно лишнее)
                return false;
            }
        });
    // Drag-and-Drop Pic end

    // Авто удлинение inputLettering
    $.each ($ ('textarea[data-autoresize]'), function () {
        let offset = this.offsetHeight - this.clientHeight;
        let resizeTextarea = function (el) {
            $ (el).css ('height', 'auto').css ('height', el.scrollHeight + offset);
        };
        $ (this).on ('keyup input', function () {
            resizeTextarea (this);
        }).removeAttr ('data-autoresize');
    })

});