# mldonkey-next

mldonkey-next is a modern responsive webapp for an existing mldonkey installations. It requires the installation of a bridge (named backend in the repo). The backend provides a bridge to the mldonkey core and serves the mldonkey-next webapp. mldonkey-next is in development and will not include all the features of the original webapp.

Desktop             |  Mobile
:-------------------------:|:-------------------------:
![desktop](docs/mldonkey-next_desktop.png)  |  ![mobile](docs/mldonkey-next_mobile.png)

## Installation

mldonkey is currently a bit outdated and requires a specific setup to work properly. This is why I typically use it in docker: https://github.com/carlonluca/docker-mldonkey. mldonkey-next is provided as a dev version of that image, so you can install it by using one of the tags of that image. To choose a proper tag for your use case, refer to [this table](https://bugfreeblog.duckdns.org/docker-images-for-the-mldonkey-service).

Using mldonkey-next without docker is not currently supported. 

More information on how to install mldonkey-next can be found in the docker repo: https://github.com/carlonluca/docker-mldonkey.

## Webapp

The new mldonkey-next gui is available in the container on port 4081. The old webapp is still available on port 4080. You can use both apps, even at the same time.