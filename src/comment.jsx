// import React, { useState, useRef, useEffect } from "react";
// import axios from 'axios';
// import styles from "./Comment.module.css";

// const Action = ({ handleClick, type, className }) => {
//   return (
//     <div className={className} onClick={handleClick}>
//       {type}
//     </div>
//   );
// };

// const Comment = ({
//   handleInsertNode,
//   handleEditNode,
//   handleDeleteNode,
//   comment,
//   issueId,
//   fetchComments,
// }) => {
//   const [input, setInput] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (editMode) inputRef.current?.focus();
//   }, [editMode]);

//   const onAddComment = async () => {
//     if (editMode) {
//       try {
//         const token = localStorage.getItem('authToken'); // Get token from local storage
//         await axios.patch('http://51.20.81.93:80/api/comment', {
//           commentID: comment._id,
//           comment: inputRef.current?.innerText
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         // handleEditNode(comment.id, inputRef.current?.innerText);
//         fetchComments();
//         setEditMode(false);
//       } catch (error) {
//         console.error('Error updating comment:', error);
//       }
//     } else {
//       try {
//         const token = localStorage.getItem('authToken'); // Get token from local storage
//         await axios.post('http://51.20.81.93:80/api/comment', {
//           ticketID: issueId,
//           comment: input
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         fetchComments();
//         setInput("");
//       } catch (error) {
//         console.error('Error adding comment:', error);
//       }
//     }
//   };

//   const handleDelete = async () => {
//     if (confirmDelete) {
//       try {
//         const token = localStorage.getItem('authToken'); // Get token from local storage
//         await axios.delete('http://51.20.81.93:80/api/comment', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           data: {
//             commentID: comment._id
//           }
//         });

//         fetchComments();
//       } catch (error) {
//         console.error('Error deleting comment:', error);
//       }
//     } else {
//       setConfirmDelete(true);
//     }
//   };

//   const cancelDelete = () => {
//     setConfirmDelete(false);
//   };

//   return (
//     <div className={comment.id === 1 ? styles.inputContainer : styles.commentContainer}>
//       {comment.id === 1 ? (
//         <>
//           <div className={styles.inputSection}>
//             <input
//               type="text"
//               className={`${styles.inputContainer__input} ${styles.first_input}`}
//               autoFocus
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type a comment..."
//             />
//             <Action
//               className={`${styles.reply} ${styles.comment} ${styles.commentButton}`}
//               type="ADD COMMENT"
//               handleClick={onAddComment}
//             />
//           </div>
//         </>
//       ) : (
//         <>
//           <span
//             contentEditable={editMode}
//             suppressContentEditableWarning={editMode}
//             ref={inputRef}
//             style={{ wordWrap: "break-word" }}
//           >
//             {comment.comment}
//           </span>

//           <div style={{ display: "flex", marginTop: "5px" }}>
//             {editMode ? (
//               <>
//                 <Action
//                   className={styles.reply}
//                   type="SAVE"
//                   handleClick={onAddComment}
//                 />
//                 <Action
//                   className={styles.reply}
//                   type="CANCEL"
//                   handleClick={() => {
//                     if (inputRef.current) inputRef.current.innerText = comment.comment;
//                     setEditMode(false);
//                   }}
//                 />
//               </>
//             ) : (
//               <>
//                 {!confirmDelete && (
//                   <Action
//                     className={styles.reply}
//                     type="EDIT"
//                     handleClick={() => setEditMode(true)}
//                   />
//                 )}
//                 <Action
//                   className={styles.reply}
//                   type={confirmDelete ? "CONFIRM" : "DELETE"}
//                   handleClick={handleDelete}
//                 />
//                 {confirmDelete && (
//                   <Action
//                     className={styles.reply}
//                     type="CANCEL"
//                     handleClick={cancelDelete}
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         </>
//       )}

//       {comment.items && comment.items.length > 0 && (
//         <div style={{ paddingLeft: 20 }}>
//           <span style={{ marginLeft: '-57px', fontSize: '21px', fontWeight: 'bold', color: '#213351' }}>Comments</span>
//           {comment.items.map((cmnt) => (
//             <Comment
//               key={cmnt.id}
//               handleInsertNode={handleInsertNode}
//               handleEditNode={handleEditNode}
//               handleDeleteNode={handleDeleteNode}
//               comment={cmnt}
//               issueId={issueId}
//               fetchComments={fetchComments}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const useNode = () => {
//   const insertNode = (tree, commentId, item) => {
//     if (tree.id === commentId) {
//       tree.items.push({
//         id: new Date().getTime(),
//         name: item,
//         items: [],
//       });
//       return tree;
//     }

//     tree.items = tree.items.map((ob) => insertNode(ob, commentId, item));
//     return tree;
//   };

//   const editNode = (tree, commentId, value) => {
//     if (tree.id === commentId) {
//       tree.name = value;
//       return tree;
//     }

//     tree.items = tree.items.map((ob) => editNode(ob, commentId, value));
//     return tree;
//   };

//   const deleteNode = (tree, id) => {
//     tree.items = tree.items.filter((item) => item.id !== id);
//     tree.items.forEach((item) => deleteNode(item, id));
//     return tree;
//   };

//   return { insertNode, editNode, deleteNode };
// };

// export { Comment, useNode };
