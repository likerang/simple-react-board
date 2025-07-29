import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";


const Board = ({id, title, registerid, date, onCheckboxChange})=>{//checked 된 여부
  
  return(
    <tr>
      <td>
        <Form.Check // prettier-ignore
            type="checkbox"
            id={`default-${id}`}
            onChange={(e)=>{
              onCheckboxChange(id, e.target.checked);
            }}
        />
      </td>
      <td>{id}</td>
      <td><Link to={`/view/${id}`}>{title}</Link></td>
      <td>{registerid}</td>
      <td>{date}</td>
    </tr>
  )
}


const BoardList = ({setmodify})=>{
  const [BoardList, setBoardList] = useState([]);
  const [checkList, setcheckList] = useState([]);

  const getList = useCallback(()=>{
    axios.get('http://34.64.182.207:8000/list')
    .then( (res) => {
      // 성공 핸들링
      //console.log(res.data);
      setBoardList(res.data);
    })
    .catch( (err) => {
      // 에러 핸들링
      console.log(err);
      alert('에러');
    });
  },[]);

  useEffect(()=>{
    getList();
  },[getList]) //최초 한번 작동, getList 함수 변동시 함수 재실행

  const onCheckboxChange = (id, checked)=>{ //checked가 true면 내용을 바꿔줌
    console.log(id, checked);
    setcheckList(prev=> //이전 값을 가지고
      checked? [...prev, id]:prev.filter(p=> p !== id)
    )
  }
  console.log(checkList);

  const handleModify = ()=>{
    /*
      선택한 값이 없다면 '최소 하나의 게시글을 선택해주세요'
      선택한 값이 여러개라면 '수정할 하나의 게시글만 선택해주세요'
    */
   if(checkList.length === 0){
    alert('최소 하나의 게시글을 선택해주세요!');
   }else if(checkList.length > 1){
    alert('수정할 하나의 게시글만 선택해주세요!');
   }else{
    setmodify(checkList[0]);
   }
  }

  const handleDelete = ()=>{
    //선택한 게시물이 없다면 '삭제할 게시글을 선택해주세요!' 경고 띄우기
    if(checkList.length === 0){
      alert('삭제할 게시글을 선택해주세요!');
      return; //함수 종료
    }

    let boardIDList = checkList.join(); // [1,2,3] -> 1,2,3
    console.log(boardIDList);
    axios.post('http://34.64.182.207:8000/delete',{boardIDList})
    .then( (res) => {
      // 성공 핸들링
      console.log(res);
      alert('삭제 완료');
      getList(); //삭제된 목록을 다시 렌더링해줘
    })
    .catch( (err) => {
      // 에러 핸들링
      console.log(err);
      alert('에러');
    });
  }

  return(
    <>
    <Table bordered hover>
      <thead>
        <tr>
          <th>선택</th>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {
          BoardList.map((list)=><Board 
            key={list.BOARD_ID}
            id={list.BOARD_ID}
            title={list.BOARD_TITLE}
            registerid={list.REGISTER_ID}
            date={list.REGISTER_DATE}
            onCheckboxChange={onCheckboxChange}
          />)
        }
      </tbody>
    </Table>
    <div className='d-flex justify-content-end gap-2'>
      <Link to="/write" className='btn btn-primary'>글쓰기</Link>
      <Button variant="secondary" size="sm" onClick={handleModify}>수정</Button>
      <Button variant="danger" size="sm" onClick={handleDelete}>삭제</Button>
    </div>
    </>

  )
}

export default BoardList;