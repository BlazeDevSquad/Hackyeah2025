import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdLoaded, setAdLoading } from '@/store/slices/admobSlice';
import { AppDispatch, RootState } from '@/store';
import { StatusBar } from 'react-native';

// TODO: Uncomment this if you want to use Admob
// import {
//   AdEventType,
//   AppOpenAd,
//   InterstitialAd,
//   RewardedAd,
//   RewardedAdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';

// TODO: Uncomment this
// import { admobConfig } from '@/services/admob/admobConfig';
// import { initializeAdmob } from '@/services/admob/admobService';

// TODO: Uncomment this
// const getAdUnitId = (testId: string, prodId: string): string => {
//   return __DEV__ ? testId : prodId;
// };

// TODO: Uncomment this
// const interstitial = InterstitialAd.createForAdRequest(
//   getAdUnitId(TestIds.INTERSTITIAL, admobConfig.interstitialAdUnitId)
// );
// const rewarded = RewardedAd.createForAdRequest(
//   getAdUnitId(TestIds.REWARDED, admobConfig.rewardedAdUnitId)
// );
// const appOpenAd = AppOpenAd.createForAdRequest(
//   getAdUnitId(TestIds.APP_OPEN, admobConfig.appOpenAdUnitId)
// );
// const banner = __DEV__ ? TestIds.BANNER : admobConfig.bannerAdUnitId;

export const useAdmob = () => {
  const dispatch = useDispatch<AppDispatch>();
  const admobState = useSelector((state: RootState) => state.admob);

  // TODO: Uncomment this
  const initializeAdmobService = useCallback(() => {
    // initializeAdmob(dispatch);
  }, [dispatch]);

  const hideStatusBar = () => {
    StatusBar.setHidden(true, 'fade');
  };

  // TODO: Uncomment this
  // const showStatusBar = () => {
  //   StatusBar.setHidden(false, 'fade');
  // };

  const loadInterstitial = useCallback(() => {
    dispatch(setAdLoading({ adType: 'interstitial', isLoading: true }));
    // TODO: Uncomment this
    // // interstitial.load();
  }, [dispatch]);

  const loadRewarded = useCallback(() => {
    dispatch(setAdLoading({ adType: 'rewarded', isLoading: true }));
    // TODO: Uncomment this
    // rewarded.load();
  }, [dispatch]);

  const loadAppOpen = useCallback(() => {
    dispatch(setAdLoading({ adType: 'appOpen', isLoading: true }));
    // TODO: Uncomment this
    // appOpenAd.load();
  }, [dispatch]);

  useEffect(() => {
    // TODO: Uncomment this
    // const interstitialListener = interstitial.addAdEventListener(
    //   AdEventType.LOADED,
    //   () => {
    //     dispatch(setAdLoaded({ adType: 'interstitial', isLoaded: true }));
    //     dispatch(setAdLoading({ adType: 'interstitial', isLoading: false }));
    //   }
    // );

    // const rewardedListener = rewarded.addAdEventListener(
    //   RewardedAdEventType.LOADED,
    //   () => {
    //     dispatch(setAdLoaded({ adType: 'rewarded', isLoaded: true }));
    //     dispatch(setAdLoading({ adType: 'rewarded', isLoading: false }));
    //   }
    // );

    // const appOpenListener = appOpenAd.addAdEventListener(
    //   AdEventType.LOADED,
    //   () => {
    //     dispatch(setAdLoaded({ adType: 'appOpen', isLoaded: true }));
    //     dispatch(setAdLoading({ adType: 'appOpen', isLoading: false }));
    //   }
    // );

    // loadInterstitial();
    // loadRewarded();
    // loadAppOpen();

    return () => {
      // TODO: Uncomment this
      // interstitialListener();
      // rewardedListener();
      // appOpenListener();
    };
  }, [dispatch, loadAppOpen, loadInterstitial, loadRewarded]);

  const showInterstitial = () => {
    // TODO: Uncomment this
    loadInterstitial();
    if (admobState.interstitial.isLoaded) {
      hideStatusBar();
      // TODO: Uncomment this
      // const adClosedListener = interstitial.addAdEventListener(
      //   AdEventType.CLOSED,
      //   () => {
      //     showStatusBar();
      //     adClosedListener();
      //   }
      // );
      // interstitial.show();
      dispatch(setAdLoaded({ adType: 'interstitial', isLoaded: false }));
    } else {
      console.log('Interstitial ad is not loaded');
    }
  };

  const showRewarded = () => {
    loadRewarded();
    if (admobState.rewarded.isLoaded) {
      hideStatusBar();
      // TODO: Uncomment this
      // const adClosedListener = rewarded.addAdEventListener(
      //   AdEventType.CLOSED,
      //   () => {
      //     showStatusBar();
      //     adClosedListener();
      //   }
      // );
      // rewarded.show();
      dispatch(setAdLoaded({ adType: 'rewarded', isLoaded: false }));
    } else {
      console.log('Rewarded ad is not loaded');
    }
  };

  const showAppOpen = () => {
    loadAppOpen();
    if (admobState.appOpen.isLoaded) {
      hideStatusBar();
      // TODO: Uncomment this
      // const adClosedListener = appOpenAd.addAdEventListener(
      //   AdEventType.CLOSED,
      //   () => {
      //     showStatusBar();
      //     adClosedListener();
      //   }
      // );
      // appOpenAd.show();
      dispatch(setAdLoaded({ adType: 'appOpen', isLoaded: false }));
    } else {
      console.log('App open ad is not loaded');
    }
  };

  return {
    initializeAdmobService,
    showInterstitial,
    showRewarded,
    showAppOpen,
    admobState,
    loadInterstitial,
    loadRewarded,
    loadAppOpen,
    // TODO: Uncomment this if you want to use Admob Banner
    // banner,
  };
};
