import React , {useState , useRef , useEffect} from 'react';
import Draggable from 'react-draggable';
import './draggable.less';
import {event} from '../index';

export default function MyDraggable({
    size = 200 ,
    axis = 'x',
    children ,
    onStop = function(){}
}){
    let [start , setStart] = useState(null);
    let [move , setMove] = useState(null);
    var [size ,setSize] = useState(size);
    var [max , setMax] = useState(0);
    let container = useRef(null);

    if(children?.length != 2 || !children[0] || !children[1]){
        return children;
    }

    let isHorizontal = axis == 'x';
    let style1={}  , style2 = {} , position;
    
    if(isHorizontal){
        let left = (move && start) ?  size + move - start : size;
        style1 = {
            left : 0 , width : `${left}px` 
        }
        style2 = {
            left : `${left}px`  , right : 0 
        }
        position = { x : left, y : 0 };
    }
    else{
        let top = (move && start) ?  size + move - start : size;
        style1 = {
            top : 0 , height : `${top}px`  
        }
        style2 = {
            top : `${top}px`  , bottom : 0 
        }
        position = { x : 0, y : top};
    }
    useEffect(()=> {
        function resize(){
            max = isHorizontal ? container.current.clientWidth : container.current.clientHeight;
            setMax(max);
        }
        resize();
        event.on('window.resize' , resize);
    } , [])
    
    return (
        <div className={`my-draggable ${axis}`} ref={container}>
            <div className='draggable-box' style={style2}>{children.slice(1)}</div>
            <div className='draggable-box' style={style1}>{children[0]}</div>
            <Draggable
                axis={isHorizontal ? 'x' : 'y'}
                handle=".handle"
                position={position}
                onStart={(e) => {
                    setStart(isHorizontal ? e.pageX : e.pageY);
                }}
                onDrag={(e) => {
                    let move = isHorizontal ? e.pageX : e.pageY;
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
        </div>
    )
}



