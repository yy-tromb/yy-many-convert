# yy-many-convert
convert super many media file for me
## Usage  
### **You need to install [Node.js](https://nodejs.org/en)**  
Usage: `path_to_Node.js path_to_yy-many-convert.js {source_folder} {output_folder} {MAX_PROCESS (int)}`  
### I recomend that MAX_PROCESS value is less the number of your computer cores.  
## Custom
Please edit some code.  
in line 15:`const CONVERT_COMMAND = "ffmpeg";` for your favorite converter like qaac.  
-> `const CONVERT_COMMAND = "qaac";`  
below line 16,
```js
const compile_args = (source_file, output_file) => {
    return [
        "-i",
        source_file,
        "-filter_complex",
        "[0:v]format=yuva444p,colorspace=bt709:iall=bt601-6-525:fast=1[color]",
        "-map",
        "[color]",
        "-color_range",
        "1",
        "-colorspace",
        "1",
        "-color_primaries",
        "1",
        "-color_trc",
        "1",
        "-pix_fmt",
        "yuv420p",
        "-c:v",
        "libaom-av1",
        "-crf",
        "23",
        "-still-picture",
        "1",
        "-update",
        "true",
        "-frames:v",
        "1",
        "-n",
        output_file,
    ];
};
```  
This example convert image (expected screenshots png(rgb24)) to avif(yuv420p).  
Edit for your favorite converter arguments like qaac.  
->  
```js
const compile_args = (source_file, output_file) => {
    return [
        source_file,
        "-a",
        "192k",
        "-o",
        output_file,
        "-y",
    ];
};
```  
source_file is file that you want to convert.  
output_file is file that was converted.  
source_file and output_file is automatically given.  
in line 32:`const OUTPUT_EXTENTION = ".avif";` for your favorite extention like m4a.  
->`const OUTPUT_EXTENTION = ".m4a";`. Please include `.`  
