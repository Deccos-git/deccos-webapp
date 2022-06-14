import React from 'react'
import { db, timestamp } from '../firebase/config'
import { useState, useEffect } from 'react'
import uuid from 'react-uuid'

export const Test = () => {
    const [docs, setDocs] = useState([])

    useEffect(() => {
        db.collection('ProblemAnalysis')
        .get()
        .then(querySnapshot => {
            const docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})   
            })
            setDocs(docArray)
        })
    }, [])
   
    const create = () => {
        docs && docs.forEach(doc => {

            console.log(doc)

            doc.DirectConsequences && doc.DirectConsequences.forEach(value => {

                console.log(value)

                db.collection('DirectConsequences')
                .doc()
                .set({
                    CompagnyID: doc.CompagnyID,
                    CentralProblemID: doc.ID,
                    ID: uuid(),
                    Timestamp: timestamp,
                    DirectConsequence: value
                })
            })
        })
    }

    useEffect(() => {
    //  create()
    }, [])
    

  return (
    <div>Test</div>
  )
}
