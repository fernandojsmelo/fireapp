import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConection";

import {doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot} 
  from 'firebase/firestore'

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import './app.css';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmil] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"),(snapshot)=> {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
  
        setPosts(listaPost);
      })
    }

    loadPosts();
  },[])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          // se tem usuario logado ele entra aqui...
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.id,
            email: user.email
          })
        }else{
          // não possui nenhum user logado.
          setUser(false);
          setUserDetail({})
        }
      })
    }

    checkLogin();
  }, [])

  async function handleApp(){
    //await setDoc(doc(db,"posts","12345"),{
    //  titulo: titulo,
    //  autor: autor,
    //})
    //.then(() => {
    //  console.log("DADOS REGISTRADOS COM SUCESSO")
    //})
    //.catch((error)=> {
    //  console.log("GEROU ERRO" + error)
    //})
    
    await addDoc(collection(db, "posts"),{
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("CADASTRADO COM SUCESSO")
      setAutor('');
      setTitulo('');
    })
    .catch((error) => {
      console.log("ERRO " + error)
    })
  
  }

  async function buscarPost(){

    const postRef = doc(db, "posts", "kOMiJxuc7WYgTR9zUQol")

    //await getDoc(postRef)
    //.then((snapshot) => {
    //  setAutor(snapshot.data().autor)
    //  setTitulo(snapshot.data().titulo
    //  )
    //})
    //.catch(() => {
    //  console.log("ERRO AO BUSCAR")
    //})

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR")
    })
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("POST ATUALIZADO COM SUCESSO!")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(() => {
      console.log("ERRO AO ATUALIZA POST")
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("POST DELETADO COM SUCESSO!")
    })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      console.log("USUARIO CADASTRADO COM SUCESSO!")
  
      setEmil('')
      setSenha('')
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
        alert("Senha Muito Fraca.")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("Email já Existe.")
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("USER LOGADO COM SUCESSO")

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true);

      setEmil('')
      setSenha('')
    })
    .catch(() => {
      console.log("ERRO AO FAZER O LOGIN.")
    })
  }

  async function fazerlogout(){
    await signOut(auth)
    setUser('');
    setUserDetail({});
  }

  return (
    <div>
      <h1>React + FireBase </h1>

      { user && (
        <div>
          <strong>Seja Bem-vindo(a) (Você está Logado!)</strong> 
          <br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
          <br/>
          <button onClick={fazerlogout}>Sai da Conta</button>
          <br/>
          <br/>
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmil(e.target.value)}
          placeholder="Dijite um Email"
        /><br/>

        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe Sua Senha"
        /><br/>

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>

      <br/>
      <br/>
      <hr/>

      <div className="container">
        <h2>Posts</h2>
        <br/>
        <label>ID do POst: </label>
        <input
          placeholder="Dijite o ID do Post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        /> 
        <br/>
        
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Dijite o titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor</label>
        <input
          type="text"
          placeholder="Autor do Post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          />

        <button onClick={handleApp}>Cadastra</button>
        <button onClick={buscarPost}>Buscar Post</button>

        <br/>

        <button onClick={editarPost}>Atualizar Post</button>

        <ul>
          {posts.map((post) => {
            return(
              <li key={post.id}>
                <strong> ID: {post.id}</strong>
                <br/>

                <span>Titulo: {post.titulo}</span> 
                <br/>
                <span>Autor: {post.autor} </span> 
                <br/> 
                <button onClick={ () => excluirPost(post.id)}>Excluir</button>
                <br/>
              </li>
            )
          })}
        </ul>
      </div>
    </div>

    
  );
}

export default App;
