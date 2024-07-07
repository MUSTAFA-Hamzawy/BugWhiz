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
  // currentUserId,
}) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (editMode) inputRef.current?.focus();
  }, [editMode]);

  const onAddComment = async () => {
    if (editMode) {
      try {
        const token = localStorage.getItem('authToken'); // Get token from local storage
        await axios.patch('http://51.20.81.93:80/api/comment', {
          commentID: comment._id,
          comment: inputRef.current?.innerText
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // handleEditNode(comment.id, inputRef.current?.innerText);
        fetchComments();
        setEditMode(false);
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    } else {
      try {
        const token = localStorage.getItem('authToken'); // Get token from local storage
        await axios.post('http://51.20.81.93:80/api/comment', {
          ticketID: issueId,
          comment: input
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        fetchComments();
        setInput("");
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('authToken'); // Get token from local storage
        await axios.delete('http://51.20.81.93:80/api/comment', {
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
        console.error('Error deleting comment:', error);
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
              <Avatar sx={{ width: 24, height: 24, mr: 1 }} alt={comment.userID.fullName} src={comment.userID && comment.userID.image ? comment.userID.image : null} />
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
          <div style={{ display: "flex", marginTop: "10px" }}>
            {editMode ? (
              <>
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
                  }}
                />
              </>
            ) : (
              <>
              
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
            </>
            )}
          </div>
            ):null}
          <div>
          <Grid item>
              <Typography variant="caption" display="block" sx={{ mt: 1.1 }}>
                <span style={{ color: 'grey',marginRight:'4px' }}>Created at</span> {new Date(comment.createdAt).toLocaleString('en-GB')}
              </Typography>
              <Typography variant="caption" display="block">
                <span style={{ color: 'grey',marginRight:'4px' }}>Edited at</span> {new Date(comment.updatedAt).toLocaleString('en-GB')}
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
              // currentUserId = {currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Comment };
