import { AppDispatch } from '@/store';

//TODO: 1. Uncomment this to use Admob 👇
// import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
// import { setAdmobReady } from '@/store/slices/admobSlice';

export const initializeAdmob = (dispatch: AppDispatch) => {
  //TODO: 2. Uncomment this to use Admob 👇
  // mobileAds().setRequestConfiguration({
  //   maxAdContentRating: MaxAdContentRating.G,
  //   tagForChildDirectedTreatment: true,
  //   tagForUnderAgeOfConsent: true,
  // });
  //TODO: 3. Uncomment this to use Admob 👇
  // mobileAds()
  //   .initialize()
  //   .then((adapterStatuses) => {
  //     if (adapterStatuses[0].state === 1) {
  //       // console.log('Mobile Ads are ready');
  //       dispatch(setAdmobReady(true));
  //     } else {
  //       // console.log('Mobile Ads are not ready');
  //       dispatch(setAdmobReady(false));
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error, 'error');
  //   });
};
