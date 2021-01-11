import React , {useState , useRef , useEffect} from 'react';
import Draggable from 'react-draggable';
import {event} from '@/index';

export default function MyDraggable({
    size = 200 ,
    children ,
    onStop = function(){}
}){
    function resize(){
        if(container.current){
            max = container.current.clientHeight;
            setMax(max);
        }
    }
    let [start , setStart] = useState(null);
    let [move , setMove] = useState(null);
    var [size ,setSize] = useState(size);
    var [max , setMax] = useState(0);
    let container = useRef(null);
    let style1={}  , style2 = {} , position;

    useEffect(()=> {
        resize();
        event.on('window.resize' , resize);
        return () => event.off('window.resize' , resize);
    } , [])
    let isDrag = children?.length == 2 && children[0] && children[1];
    let top = (move && start) ?  size + move - start : size;
    style1 = {
        top : 0 , height : `${top}px`  
    }
    style2 = {
        top : `${top}px`  , bottom : 0 
    }
    position = { x : 0, y : top};

    if(!isDrag){
        style1 = {top:0 , height : '100%'};
        style2 = {display : 'none'};
    }
    
    return (
        <div className={`my-draggable y`} ref={container}>
            <div className='draggable-box' style={style2}>{children.slice(1)}</div>
            <div className='draggable-box' style={style1}>{children[0]}</div>
            {
                isDrag && 
                <Draggable
                    axis='y'
                    handle=".handle"
                    position={position}
                    onStart={(e) => {
                        setStart(e.pageY);
                    }}
                    onDrag={(e) => {
                        let move = e.pageY;
                        if(move + size - start < 100 ){
                            move = 100 + start - size;
                        }
                        if(move + size - start > max - 100){
                            move = max + start - size - 100;
                        }
                        setMove(move);
                    }}
                    onStop={(e) => {
                        if(!start || !move){
                            return;
                        }
                        setSize(size + move - start)
                        setStart(null);
                        setMove(null);
                        onStop();
                    }}
                    >
                    <div className='handle' >
                    </div>
                </Draggable>
            }
            
        </div>
    )
}



