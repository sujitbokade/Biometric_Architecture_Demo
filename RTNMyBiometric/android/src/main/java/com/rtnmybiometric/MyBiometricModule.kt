package com.rtnmybiometric

import android.content.pm.PackageManager
import android.os.Build
import android.os.Handler
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.rtnmybiometric.NativeMyBiometricSpec
import java.util.concurrent.Executor

class MyBiometricModule(context: ReactApplicationContext?): NativeMyBiometricSpec(context) {

    private var biometricPrompt: BiometricPrompt? = null
    private var myBiometricPromise: Promise? = null
    private var executor: Executor? = null
    private var promptInfo: BiometricPrompt.PromptInfo? = null

    override fun getName(): String {
        return NAME
    }

    override fun getAvailableBiometric(promise: Promise?) {
        myBiometricPromise = promise
        val packageManager = currentActivity?.packageManager
        if (Build.VERSION.SDK_INT >= 29) {
            when {
                packageManager?.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT) == true -> {
                    myBiometricPromise?.resolve("FINGERPRINT")
                }
                packageManager?.hasSystemFeature(PackageManager.FEATURE_FACE) == true -> {
                    myBiometricPromise?.resolve("FACE")
                }
                else -> {
                    myBiometricPromise?.reject(
                        "no_biometric_found",
                        "no_biometric_found"
                    )
                }
            }
        } else if (Build.VERSION.SDK_INT >= 23) {
            if (packageManager?.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT) == true) {
                myBiometricPromise?.resolve("FINGERPRINT")
            } else {
                myBiometricPromise?.resolve("FACE")
            }
        } else {
            myBiometricPromise?.reject(
                "no_biometric_found",
                "no_biometric_found",
            )
        }
    }

    override fun authenticate(promise: Promise?) {
        myBiometricPromise = promise
        canAuthenticate()
    }

    private fun canAuthenticate() {
        val handler = currentActivity?.mainLooper?.let { Handler(it) }
        handler?.post {
            val bioMetricManager = currentActivity?.let { BiometricManager.from(it) }
            when (
                bioMetricManager?.canAuthenticate(
                    BiometricManager.Authenticators.BIOMETRIC_WEAK
                            or BiometricManager.Authenticators.BIOMETRIC_STRONG
                )
            ) {
                BiometricManager.BIOMETRIC_SUCCESS -> {
                    login()
                }
                BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
                    myBiometricPromise?.reject(
                        "no_biometric_feature",
                        "no_biometric_feature"
                    )
                }
                BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
                    myBiometricPromise?.reject(
                        "currently_unavailable",
                        "currently_unavailable"
                    )
                }
                BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                    myBiometricPromise?.reject(
                        "user_has_no_biometric",
                        "user_has_no_biometric"
                    )
                }
                BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED -> {
                    myBiometricPromise?.reject(
                        "error_security",
                        "error_security"
                    )
                }
                BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED -> {
                    myBiometricPromise?.reject(
                        "not_supported",
                        "not_supported"
                    )
                }
                BiometricManager.BIOMETRIC_STATUS_UNKNOWN -> {
                    myBiometricPromise?.reject(
                        "error_unknown",
                        "error_unknown"
                    )
                }
            }
        }
    }

    private fun login() {
        executor = currentActivity?.let { ContextCompat.getMainExecutor(it) }

        promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric Login")
            .setSubtitle("Login with biometric")
            .setAllowedAuthenticators(
                BiometricManager.Authenticators.BIOMETRIC_WEAK
                        or BiometricManager.Authenticators.DEVICE_CREDENTIAL
            )
            .build()

        biometricPrompt = BiometricPrompt(
            currentActivity as FragmentActivity,
            executor!!,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    val error = "Authentication error $errString"
                    myBiometricPromise?.reject(error, error)
                }

                override fun onAuthenticationSucceeded(
                    result: BiometricPrompt.AuthenticationResult
                ) {
                    super.onAuthenticationSucceeded(result)
                    myBiometricPromise?.resolve("true")
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    myBiometricPromise?.reject(
                        "authentication_failed",
                        "authentication_failed"
                    )
                }
            }
        )

        biometricPrompt?.authenticate(promptInfo!!)
    }

    companion object {
        const val NAME = "RTNMyBiometric"
    }


}