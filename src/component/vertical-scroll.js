import React from 'react';
import './vertical-scroll.less';


function VerticalScroll({children , style , need = true}){
    if(!need){
        return children;
    }else{
        return (
            <div className='react-single-app-scroll' style={style}>
                <div className='content'>
                    {children}
                </div>
            </div>
        )
    }
}

export default VerticalScroll

