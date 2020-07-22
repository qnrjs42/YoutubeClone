import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment'

function Comment(props) {

    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState('');

    const handleClick = (e) => {
        setCommentValue(e.currentTarget.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
          content: CommentValue,
          writer: user.userData._id,
          postId: props.postId,
        };

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result);
                setCommentValue('');
                props.refreshFunction(response.data.result);
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    return (
      <div>
        <br />
        <p>Relies</p>
        <hr />

        {/* Comment Lists */}
        {props.Comments &&
          props.Comments.map((comment, index) => (
              (!comment.responseTo && 
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId} />
                )
            
          ))}

        {/* Root Comment Form */}

        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={handleClick}
            value={CommentValue}
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
}

export default Comment
