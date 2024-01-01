# yy-many-convert
convert super many media file
## Usage  
### **You need to install [Node.js](https://nodejs.org/en)**  
Usage: `path_to_Node.js path_to_yy-many-convert.js {source_folder} {output_folder}`  
## Custom
Please edit some code.  
in line 14:`const MAX_PROCESS = 15;` for your choice. I recomend that this value is less your computer core counts.  
in line 15:`const CONVERT_COMMAND = "ffmpeg";` for your favorite converter like qaac.  
-> `const CONVERT_COMMAND = "qaac";`  
below line 16,
```js
const compile_args = (source_file, output_file) => {
    return [
        "-i",
        source_file,
        "-c:v",
        "libaom-av1",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-still-picture",
        "1",
        "-y",
        output_file,
    ];
};
```  
edit for your favorite converter arguments like qaac.  
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
output_file is file that is converted.  
source_file and output_file is automatically given.
in line 32:`const OUTPUT_EXTENTION = ".avif";` for your favorite extention like m4a.  
->`const OUTPUT_EXTENTION = ".m4a";`. Please include `.`  
