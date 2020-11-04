function getDynamicContainer(){
    var container = document.getElementById('dynamic-css');
    if(!container){
        container = document.createElement('style');
        container.id = 'dynamic-css';
        document.head.append(container);
    }
    return container;
}



function createMenuStyle(style){
    if(!style){
        getDynamicContainer().innerHTML = '';
        return;
    }
    var css = `
        .sub-content .menu{
            background: ${style.backgroundColor};
        }
        .sub-content .menu .menu-group{
            border-color: ${style.borderColor};
        }
        .sub-content .menu .menu-group *{
            color : ${style.color};
        }
        .sub-content .menu .menu-group .main-title:hover , .sub-content .menu .menu-group .sub-list .sub-title:hover , .sub-content .menu .menu-group .checked{
            background: ${style.checkedBackgroundColor};
        }
        .sub-content .menu.full .logo{
            background-image:url(${style.logoFull});
        }
        .sub-content .menu.smart .logo{
            background-image:url(${style.logoSmart});
        }
        .config-center .table-panel {
            margin:0 10px;
            box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
        }
    `;
    getDynamicContainer().innerHTML = css;
}


function createTopStyle(style){
    if (!style) {
        getDynamicContainer().innerHTML = '';
        return;
    }
    var css = `
        .header{
            background: ${style.backgroundColor};
        }
        .header .menu .menu-group .main-title{
            color: ${style.color};
        }
        .header .menu .menu-group .main-title.checked , .header .menu .menu-group:hover .main-title{
            border-bottom: solid 4px ${style.checkedBorderColor};
            color: ${style.checkedBorderColor};
        }
        .header .user >div{
            color:${style.color};
        }
        .header .system-set .set{
            color:${style.color};
        }
        .header .system-set .set:hover{
            color:${style.checkedBorderColor};
        }
        .header .user .system {
            border-color:${style.systemBorderColor};
            background:${style.systemBackgroundColor};
            color:${style.systemColor};
        }
        
    `
    getDynamicContainer().innerHTML = css;
}



export {createMenuStyle , createTopStyle};