import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription:Subscription;

  constructor( public auth:AngularFireAuth,
                private store:Store<AppState>,
                private firestore: AngularFirestore) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser =>{
      if( fuser){
       this.userSubscription =  this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
        .subscribe( (firestoreUser: any) =>{
          console.log(firestoreUser);
          const user = Usuario.fromFirebase(firestoreUser)
          // const { uid, nombre, email } = firestoreUser;
          this.store.dispatch( authActions.setUser({ user }))
          // this.store.dispatch( authActions.setUser({ user: {uid, nombre, email} }))

        })
      }else{
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser())
      }
      console.log(fuser);
    });
  }

  crearUsuario( nombre:string, email:string, password:string ) {

    return this.auth.createUserWithEmailAndPassword(email, password)
            .then( ({user}) =>{
              const newUser = new Usuario(user.uid, nombre, user.email);
              return this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser })
            })

  }
  loginUsuario( email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser !=null)
    )
  }
  
}
