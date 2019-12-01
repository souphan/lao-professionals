import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/storage';

export interface Professional {
  gsxcategory: { t: string},
  gsxcity: { t: string},
  gsxcontactname: { t: string},
  gsxemail: { t: string},
  gsxorganizationname: { t: string},
  gsxphone: { t: string},
  gsxpostalcode: { t: string},
  gsxstate: { t: string},
  gsxstreetaddress: { t: string},
  gsxwebsite: { t: string},
  title: { t: string},
  id: string,
  image: string,
  imageUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private professionals: Observable<any[]>;
  private proCollection: AngularFirestoreCollection<Professional>;

  constructor(private afs: AngularFirestore) {
    this.proCollection = this.afs.collection<any>('professionals');
    this.professionals = this.proCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          data.id = id;
          return { id, ...data };

         // const data = a.payload.doc;
        });
      })
    );
  }
 
  getProfessionals(): Observable<any[]> {
    return this.professionals;
  }
 
  getProfessional(id: string): Observable<Professional> {
    return this.proCollection.doc<Professional>(id).valueChanges().pipe(
      take(1),
      map(pro => {
        pro.id = id;
        return pro
      })
    );
  }
 
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };
  
  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }

  addPro(pro: Professional): Promise<DocumentReference> {
    return this.proCollection.add(pro);
  }
 
  updatePro(pro: Professional): Promise<void> {
    return this.proCollection.doc(pro.id).update({ name: pro.gsxcontactname, email: pro.gsxemail });
  }
 
  deletePro(id: string): Promise<void> {
    return this.proCollection.doc(id).delete();
  }
}
