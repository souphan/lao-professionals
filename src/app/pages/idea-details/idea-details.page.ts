import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdeaService, Professional } from 'src/app/services/idea.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-idea-details',
  templateUrl: './idea-details.page.html',
  styleUrls: ['./idea-details.page.scss'],
})
export class IdeaDetailsPage implements OnInit {
  pro: Professional;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  image: any;
  
  constructor(private route: ActivatedRoute, private ideaService: IdeaService,
    private afStorage: AngularFireStorage,
    private imagePicker: ImagePicker,
    public loadingCtrl: LoadingController,
    private webview: WebView,
    private toastCtrl: ToastController, private router: Router) { }
 
  ngOnInit() { 
  }
 
  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = this.ref.getDownloadURL() )).subscribe();
  }

  ionViewWillEnter() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ideaService.getProfessional(id).subscribe(pro => {
        this.pro = pro;
      });
    }
  }

  addPro() {
    this.ideaService.addPro(this.pro).then(() => {
      this.router.navigateByUrl('/');
      this.showToast('Idea added');
    }, err => {
      this.showToast('There was a problem adding your idea :(');
    });
  }
 
  deletePro() {
    this.ideaService.deletePro(this.pro.id).then(() => {
      this.router.navigateByUrl('/');
      this.showToast('Idea deleted');
    }, err => {
      this.showToast('There was a problem deleting your idea :(');
    });
  }
 
  updatePro() {
    this.ideaService.updatePro(this.pro).then(() => {
      this.showToast('Idea updated');
    }, err => {
      this.showToast('There was a problem updating your idea :(');
    });
  }
 
  openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    const toast = await this.toastCtrl.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.presentLoading(loading);
    // let image_to_convert = 'http://localhost:8080/_file_' + image;
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    //uploads img to firebase storage
    this.ideaService.uploadImage(image_src, randomId)
    .then(photoURL => {
      this.image = photoURL;
      loading.dismiss();
      toast.present();
    }, err =>{
      console.log(err);
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}