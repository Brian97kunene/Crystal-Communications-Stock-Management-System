class MyClass {


    static  formatDate(date) {
        let a = date.split("T")
        let aa = a[1].split(".")


        const formated = a[0] +" at: "+ aa[0];

       // console.log(formated);
        const d = new Date(date);
        const newdate = d.toLocaleString();

        return newdate
    }















    static async insertProduct(product, supp_code) {
        const port = 5552;

        try {
           

           
            const response = await fetch(`http://localhost:${port}/createproduct`, {
                method: "POST", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    product: product,
                    supplier_code: supp_code
                }),
            });

            //var prod = JSON.stringify( x ) ;



            return response;

        }
        catch (err) {



            return err;

        };



    }






















    static async getLiveProducts() {



        try {
            
            var response = await fetch("http://localhost:5555/api/syntech-feed");

            const data = await response.json();
            console.log(data);
            return data.products ;
        }
        catch(err)
        { console.log(err); }


    }
    static async getProducts() {
        const port = 5552;         

        const response = await fetch(`http://localhost:${port}/getproductcount`)


        var data = response.json();

        return data;

    }

    static async deleteProducts(products, supp_code) {
        const port = 5552;
        

        try {
            let prods = [];
            products.forEach((i) => {
                prods.push({ sku:i });
      
               // console.log("these are ", i);
              //  console.log("sup ", supp_code);
            }
            
            );
        console.log(prods);
                const response =  await fetch(`http://localhost:${port}/api/syntech/bulk-delete`, {
                    method: "DELETE", // or "PATCH" if partial updates
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        rows: prods,
                        supplier: supp_code
                    }),
                });

                //var prod = JSON.stringify( x ) ;

                

                return response;

            }
            catch (err) {

               

                return err;

        };



    }


    static async insertProducts(products, supp_code) {
        const port = 5552;

        try {
            let prods = [];
            products.forEach(i => {
                prods.push(i);
                console.log("these are ", i);
            }

            );
            const response = await fetch(`http://localhost:${port}/api/syntech/bulk-insert`, {
                method: "POST", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    rows: prods,
                    supplier: supp_code
                }),
            });

            //var prod = JSON.stringify( x ) ;



            return response;

        }
        catch (err) {



            return err;

        };



    }
   





    static async updateProducts(products, supp_code) {
        const port = 5552;

        try {
            let prods = [];
            products.forEach(i => {
                prods.push(i);
                console.log("these are ", i);
            }

            );
            const response = await fetch(`http://localhost:${port}/api/syntech/bulk-update`, {
                method: "POST", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    rows: prods,
                    supplier: supp_code
                }),
            });

            //var prod = JSON.stringify( x ) ;



            return response;

        }
        catch (err) {



            return err;

        };



    }


}

export default  MyClass;