import React from 'react'
import { db, timestamp } from '../firebase/config'
import { useState, useEffect } from 'react'
import uuid from 'react-uuid'
import {useFirestoreQuestionnairesResponsesMoments} from '../firebase/useFirestore'

export const Test = () => {
   
    const responses = useFirestoreQuestionnairesResponsesMoments('7fec082-f4d4-0d3-b16c-632d15076245')

    responses && responses.forEach(respons => {

        db.collection('QuestionnairesResponses')
        .doc(respons.docid)
        .update({
            Position: 2
        })
    })
    

  return (
    <div>Test</div>
  )
}
