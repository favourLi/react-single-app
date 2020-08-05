
function createMenuStyle(style){
    if(!style){
        document.getElementById('dynamic-css').innerHTML = '';
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
    `;
    document.getElementById('dynamic-css').innerHTML = css;
}


function createTopStyle(style){
    if (!style) {
        document.getElementById('dynamic-css').innerHTML = '';
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
    document.getElementById('dynamic-css').innerHTML = css;
}
// createMenuStyle({
//     backgroundColor: '#409EFF',
//     borderColor: '#3596F9',
//     color:'#e0f0ff',
//     hoverBackgroundColor: '#1C88F8'
// })

// createMenuStyle({
//     backgroundColor: 'red',
//     borderColor: 'blue',
//     color: '#000',
//     checkedBackgroundColor: '#ff5500'
// })

// createHeaderStyle({
//     backgroundColor : '#000',
//     color:'blue' ,
//     checkedBorderColor : 'yellow',
//     systemBorderColor: 'red' ,
//     systemBackgroundColor : '#ff5500',
//     systemColor : '#fff'
// })



export {createMenuStyle , createTopStyle};