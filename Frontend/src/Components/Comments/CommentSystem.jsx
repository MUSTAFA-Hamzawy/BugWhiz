import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';

import {
  Grid,
  Typography,
  Avatar,
} from '@mui/material';

import styles from "./Comment.module.css";

const Action = ({ handleClick, type, className }) => {
  return (
    <div className={className} onClick={handleClick}>
      {type}
    </div>
  );
};

const Comment = ({
  comment,
  issueId,
  fetchComments,
}) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');

  const [error, setError] = React.useState('');


  useEffect(() => {
    if (editMode) {
      const elem = inputRef.current;
      if (elem) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(elem);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        elem.focus();
      }
    }
  }, [editMode]);

  const onAddComment = async () => {
    if (editMode) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.patch(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/comment`, {
          commentID: comment._id,
          comment: inputRef.current?.innerText
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setError('');
        fetchComments();
        setEditMode(false);
      } catch (error) {
        setError(error.response.data.message);
      }
    } else {
      try {
        const token = localStorage.getItem('authToken');
        await axios.post(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/comment`, {
          ticketID: issueId,
          comment: input
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setError('');
        fetchComments();
        setInput("");
      } catch (error) {
        setError(error.response.data.errorDescription);
      }
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/comment`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            commentID: comment._id
          }
        });

        fetchComments();
        setConfirmDelete(false);
      } catch (error) {
      }
    } else {
      setConfirmDelete(true);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className={comment.id === 1 ? styles.inputContainer : styles.commentContainer}>
      {comment.id === 1 ? (
        <>
          {error ? (<span style={{color:'red', fontSize:'16px', marginTop:'-10px'}}>{error}</span>):null}
          <div className={styles.inputSection}>
            <input
              type="text"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a comment..."
            />
            <Action
              className={`${styles.reply} ${styles.comment} ${styles.commentButton}`}
              type="ADD COMMENT"
              handleClick={onAddComment}
            />
          </div>
        </>
      ) : (
        <>
          <div style={{marginBottom:'5px'}}>
          <Grid item xs={9} display="flex" alignItems="center">
              <Avatar sx={{ width: 28, height: 28, mr: 1 }} alt={comment.userID.fullName} src={comment.userID && comment.userID.image ? `${process.env.REACT_APP_BUGWHIZ_API_URL}/${comment.userID.image}` : null} />
              <Typography variant="body2">{comment.userID.fullName}</Typography>
          </Grid>
          </div>
          <div style={{padding:'3px 15px'}}>
            <span
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              className={editMode ? styles.inputContainer__input : ''}
              style={{ wordWrap: "break-word", width: '100%', color:'rgb(74 74 74' }}
            >
              {comment.comment}
            </span>
          </div>


          {currentUserId === comment.userID._id ? (
          <div style={{marginTop: "10px" }}>
            {editMode ? (
              <>
              {error ?
              <div style={{marginTop:'-18px', marginBottom:'12px', marginLeft:'63px'}}>
               <span style={{color:'red', fontSize:'16px'}}>{error}</span>
              </div> :null}
               <div style={{display:'flex'}}>
                <Action
                  className={styles.reply}
                  type="SAVE"
                  handleClick={onAddComment}
                />
                <Action
                  className={styles.reply}
                  type="CANCEL"
                  handleClick={() => {
                    if (inputRef.current) inputRef.current.innerText = comment.comment;
                    setEditMode(false);
                    setError('');
                  }}
                />
                </div>
              </>
            ) : (
              <>
              <div style={{display:'flex'}}>
                <>
                {!confirmDelete && (
                  <Action
                    className={styles.reply}
                    type="EDIT"
                    handleClick={() => setEditMode(true)}
                  />
                )}
                <Action
                  className={styles.reply}
                  type={confirmDelete ? "CONFIRM" : "DELETE"}
                  handleClick={handleDelete}
                />
                {confirmDelete && (
                  <Action
                    className={styles.reply}
                    type="CANCEL"
                    handleClick={cancelDelete}
                  />
                )}
              </>
              </div>
            </>
            )}
          </div>
            ):null}
          <div>
          <Grid item>
              <Typography variant="caption" display="block" sx={{ mt: 1.1 }}>
                <span style={{ color: 'grey',marginRight:'4px' }}>{comment.createdAt}</span> 
              </Typography>
            </Grid>
          </div>
        </>
      )}

      {comment.items && comment.items.length > 0 && (
        <div style={{ paddingLeft: 20 }}>
          <span style={{ marginLeft: '-57px', fontSize: '21px', fontWeight: 'bold', color: '#213351' }}>Comments</span>
          {comment.items.map((cmnt) => (
            <Comment
              key={cmnt.id}
              comment={cmnt}
              issueId={issueId}
              fetchComments={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Comment };
