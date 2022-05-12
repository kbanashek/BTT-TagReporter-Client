import React,{useRef}from 'react'
import {Text,View,Button,Dimensions} from 'react-native'
import Modal from 'react-native-modalbox'
import { useState } from 'react'

var screen=Dimensions.get('window')

const AddModalBox=(props)=>{
    let isOpen=false;    
    const show=useRef()

    const showModal=()=>{
        isOpen = true;
    }

    showModal()

    return(
        <>
        <Modal  style={{width:screen.width-80,height:200,justifyContent:'center'}}
        position='center'
        backdrop={true}
        ref={show}
        isOpen={isOpen}
        >
        <Text>hello from modal</Text>
        </Modal>
        </>
    )
}

export default AddModalBox;