import * as React from 'react';
import {
    asset, 
    View,  
} from 'react-360';
import Entity from 'Entity';

export default class Deathstar extends React.Component {
      
  render() {
      console.log('rednering death');
    return (
        <View
            style={{
                transform: [{translate: [0, 200, 200]}],
                width: 200,
                height: 200,
            }}>

            <Entity
                source={{obj: asset('death-star.obj'), mtl: asset('death-star.mtl')}}
                style={{transform: [
                        {translate: [-100, 0, -2]},
                        {scaleX : 100},
                        {scaleY:100},
                    ],
                    width: 200,
                    height: 200,   
                }}
            />
        </View>
     ) }
}
