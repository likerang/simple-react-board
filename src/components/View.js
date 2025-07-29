import { useEffect, useState } from "react";
import axios from 'axios';
import {
  Link,
  useParams
} from "react-router-dom";

const View = ()=>{
  const [board, setBoard] = useState({
    title:'', 
    content:'',
    image:''
  });
  let {id} = useParams();
  console.log(id);

  useEffect(()=>{
    axios.get(`http://34.64.182.207:8000/detail?id=${id}`)
    .then( (res) => {
      // 성공 핸들링
      console.log(res.data);
      setBoard({
        title:res.data[0].BOARD_TITLE,
        content: res.data[0].BOARD_CONTENT,
        image_path: res.data[0].IMAGE_PATH
      });
    })
    .catch( (err) => {
      // 에러 핸들링
      console.log(err);
      alert('에러');
    });
  },[id]) //최초 한번 작동, getList 함수 변동시 함수 재실행


  return(
    <div>
      <h4>{board.title}</h4>
      <div>{board.content}</div>
      {board.image_path && <div className="attachment"><img src={`http://34.64.182.207:8000/${board.image_path}`} alt=""/></div>}
      <hr/>
      <Link to="/" className="btn btn-info">목록</Link>
    </div>
  )
}

export default View;