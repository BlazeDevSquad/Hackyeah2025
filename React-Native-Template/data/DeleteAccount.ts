type DeleteAccountReason = {
  label: string;
  value: string;
};

export const DeleteAccountReasons: DeleteAccountReason[] = [
  //? you can use it like that with i18n
  // label: 'deleteAccount.reasons.privacy', -> Go to the i18n file and add the key
  // Then go to the Delete Account Page and add this:
  // t(item.label)
  // something like that but you got the point.
  {
    label: 'Privacy',
    value: 'privacy',
  },
  {
    label: 'Dissatisfaction',
    value: 'dissatisfaction',
  },
  {
    label: 'Too Many Ads',
    value: 'tooManyAds',
  },
  {
    label: 'Competition',
    value: 'competition',
  },
  {
    label: 'Too Many Notifications',
    value: 'tooManyNotifications',
  },
  {
    label: 'Too Expensive',
    value: 'tooExpensive',
  },
  {
    label: 'Other',
    value: 'other',
  },
];
