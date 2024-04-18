package com.reactnativenewarchbiometric

import android.view.Gravity
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ToastService(private val reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return  "ToastModule"
    }

    @ReactMethod
    fun showToast(message: String, pos:String){
        val toast = Toast.makeText(reactContext, message, Toast.LENGTH_SHORT)
        if(pos == "Bottom"){
            toast.setGravity(Gravity.BOTTOM, 0, 80)
        } else if(pos == "Center") {
            toast.setGravity(Gravity.CENTER, 0, 0)
        } else{
            toast.setGravity(Gravity.TOP, 0, 50)
        }

        toast.show()
   }
}
