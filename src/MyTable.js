import React, {useState, useEffect, useRef} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {db} from './firebase'


const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'fullName', headerName: 'Full Name', width: 130 },
  { field: 'subject', headerName: 'Subject', width: 130 },
  { field: 'roll', headerName: 'Role', width: 130,},
  { field: 'class', headerName: 'Class', width: 160},
];

export default function MyTable() {
    const [checked, setChecked] = useState([])
    const [showAdd, setShowAdd] = useState("none")
    const [showUpdate, setShowUpdate] = useState("none")
    const [myData, setMyData] = useState("")
    const nameRef = useRef(null)
    const subjectRef = useRef(null)
    const roleRef = useRef(null)
    const classRef = useRef(null)
    const updateNameRef = useRef(null)
    const updateSubjectRef = useRef(null)
    const updateRoleRef = useRef(null)
    const updateClassRef = useRef(null)

    useEffect(()=> {updateDatabase()},[])

    function updateDatabase(){
        db.on("value", (snapshot) =>{
            let myData = ""
            myData = (snapshot.val().students);
            setMyData(myData)
        })
    }

    function updateItem(e){
        e.preventDefault()
        const studentsRef = db.child("students");
        for (let id of checked){
            studentsRef.child(id-1).update({
                "fullName": updateNameRef.current.value || myData[id-1].fullName,
                "subject": updateSubjectRef.current.value || myData[id-1].subject,
                "roll": updateRoleRef.current.value || myData[id-1].roll,
                "class": updateClassRef.current.value || myData[id-1].class
            })
        }
        updateNameRef.current.value=""
        updateSubjectRef.current.value=""
        updateRoleRef.current.value=""
        updateClassRef.current.value=""
        setShowUpdate("none")
        setChecked([])
      }

    function removeItem(){
        if (window.confirm("please confirm to delete item no."+checked.join(","))){
            console.log(checked[0]-1)
            for (let id of checked){
                db.child("students").child(id-1).remove()
            }
            setChecked([])
        }
    }

    function addData(e){
        e.preventDefault()
        var studentsRef = db.child("students");
        studentsRef.child(myData.length).set({
          "id":myData.length+1,
          "fullName": nameRef.current.value,
          "subject": subjectRef.current.value,
          "roll": roleRef.current.value,
          "class": classRef.current.value
        }).then(()=>setShowAdd("none"));
      }

  return (
    <div style={{ height: 400, width: '100%' }}>
        {myData? 
        <DataGrid rows={myData.filter((element)=>{return (element!==false)})} columns={columns} pageSize={6} checkboxSelection onSelectionModelChange={(newSelection) => {
            setChecked(newSelection.selectionModel)
          }} selectionModel={checked} />
        :""}
        <button onClick={removeItem}>remove checked items</button>

        <button onClick={()=>setShowAdd("block")}>Create a new item</button>
                <form style={{padding:"5px",display:showAdd}} onSubmit={(e)=>addData(e)}>
                  <div>
                    <input style={{width:"200px"}} ref={nameRef} placeholder="name" type="text" required/>
                  </div>
                  <div>
                  <span>please select a subject</span><br/>
                    <select style={{width:"200px"}} ref={subjectRef}>
                      <option value="Firebase RealTime Database">Firebase RealTime Database</option>
                      <option value="Math">React</option>
                    </select>
                  </div>
                  <div>
                    <span>please select a role</span><br/>
                    <select style={{width:"200px"}} ref={roleRef}>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div>
                    <span>please select a class</span><br/>
                    <select style={{width:"200px"}} ref={classRef}>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Math">Math</option>
                    </select>
                  </div>
                  <button>ADD DATA</button>
                </form>
                <br/>
                <button onClick={()=>setShowUpdate("block")}>UPDATE DATA</button>

                <form style={{padding:"5px", display:showUpdate}} onSubmit={(e)=>updateItem(e)}>
                <span>Please leave blank to keep unchanged</span><br/>
                  <div>
                    <input ref={updateNameRef} placeholder="name" type="text" />
                  </div>
                  <div>
                    <input ref={updateSubjectRef} placeholder="subject" type="text" />
                  </div>
                  <div>
                    <input ref={updateRoleRef} type="text" placeholder="role" />
                  </div>
                  <div>
                    <input ref={updateClassRef} type="text" placeholder="class" />
                  </div>
                  <button>UPDATE ITEM</button>
                </form>

    </div>
  );
}
