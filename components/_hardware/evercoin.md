---
title: YubiKey 5Ci by Evercoin
appId: evercoin
authors:
- danny
released: 2019-11-12
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Evercoin and Yubico
providerWebsite: https://evercoin.com/home
website: 
shop: https://www.yubico.com/ph/product/yubikey-5ci/
country: US
price: 70USD
repository: 
issue: 
icon: evercoin.png
bugbounty: 
meta: ok
verdict: noita
date: 2022-04-29
signer: 
reviewArchive: 
twitter: evercoin
social: 

---

## Background Information

[Evercoin has released an article on Medium](https://blog.evercoin.com/evercoin-is-now-the-safest-wallet-exchange-f3c3eeb07d54) with information on the hardware wallet and mobile app.

> Today, at NYC Consensus Invest, we announced Evercoin 2, the safest wallet, now with hardware security by YubiKey.

{{ page.title }} is meant to provide "hardware security" to the existing Evercoin app: {% include walletLink.html wallet='android/com.evercoin' verdict='true' %} It was also created in partnership [with YubiKey.](https://www.yubico.com/)

> Evercoin today announced the introduction of hardware security by integrating with YubiKey.

## Interface

[YubiKey 5Ci](https://www.yubico.com/ph/product/yubikey-5ci/) is the newest addition to the Yubikey 5 series with support for USB-C and a lightning connector. It is able to connect to iOS and Android devices. It has no screen display or button for signing transactions.

On the other hand, the blog post linked above claims that it's the app that has to make and confirm transactions.

> Because Evercoin is mobile-first, it means we can benefit from the phone’s in-built security features. This means, unlike traditional hardware wallets, we can benefit from biometric features on the phone to accentuate the security of your wallet. So, fingerprint ID or face ID can be used where appropriate as an additional biometric authentication factor.

## On Private Keys:

> The traditional wallet back up scheme is to take a 12- or 24-word passphrase and store it in a safe place. Unfortunately, this procedure is provably prone to user error. According to Fortune magazine, Chainalysis stated that as many as 3.79M bitcoins are likely to be lost forever due to mishandling private keys.
>
> The problem is developing a service that enables a user to back up and restore their private keys (and therefore their wallet and all their assets) but in which the service provider (in this case, Evercoin) never has the private keys.
>
> In this case, this is achieved by splitting the key into two shards — neither of which on their own can restore the private key. One of the shards is stored in a special URL that is generated by the user’s device and sent directly to the user’s email (so Evercoin never sees this shard). The other shard is held by Evercoin. Because of this patent-pending approach, whenever the user loses their phone, their Yubikey, their pin, their password they can be helped and they can recover their assets.
>
> We feel that the traditional hardware wallet is very secure… but we assert that it is unsafe, and that user error can cause total loss of funds. Still, because traditional hardware wallets are so secure, we want to further make the case that we are practicing safer crypto.

## Analysis 


> The next thing that’ll happen is actually pretty exciting, which is you remove, so when you pull the Yubikey, the wallet now enters this cold storage mode.
>
> So, the cold storage mode basically means now that the private key is now no longer anywhere on the phone to be found.

This is from [an article with instructions](https://blog.evercoin.com/how-to-use-yubikey-with-evercoin-37da2a85ae48) on how to use Yubikey with Evercoin. The wallet is meant to enter an offline or a "cold storage mode" when the YubiKey device is disconnected. The article claims this makes it so that the private key won't be found anywhere on the phone.

{{ page.title }} must be connected to an external device, thus it risks exposing the keys. Although the providers state that the wallet enters a cold storage mode, there is still the risk of the app being compromised in the first place. There's also the fact that this product has **no interface** meaning it can't make transactions by itself and relies on the app to do so. 