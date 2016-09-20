import { MAPS, LOAD, COMPLETE, CHECK } from '../constants'

export function checkLoadMaps() {
    return (dispatch, state) => {

      const waitMaps = (() => {
              var maps = window.google.maps;
              console.warn('ждём: maps');
              if(maps){
                  console.warn('Дождались');
                  dispatch({
                      type: MAPS + LOAD + COMPLETE,
                      googleMaps: maps
                  })
              }else{
                  setTimeout(waitMaps(), 150);
              }
        })()



    }
}
