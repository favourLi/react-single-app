import React, { useEffect, useRef } from 'react';

function Outlet(){
    var container = useRef();
    useEffect(() => {
        var name = window.location.pathname.split('/')[1];
        window.loadOutlet(name , container.current.parentNode);
    } , [])
    return <div ref={container}></div>
}

export default Outlet;