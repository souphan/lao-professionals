import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  id: string
}

export interface Idea {
  gsxcategory: { t: string},
  gsxcity: { t: string},
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
          return { id, ...data };
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
