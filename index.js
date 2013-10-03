    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
    var slik;
    var location;
    // Promenlivi od baza
    var korisnikID;
    var ime;
    var prezime;
    var posta;
    var vozrast;
    var pol;
    var vozrastPole = null;
    var polPole = null;
    var firstNameBox = null;
    var lastNameBox = null;
    var postaBox = null;
    var db = null;
    var dataTable = null;
    var kategorija;
    //
    
    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);
    // Cordova is ready to be used!
    //
    function onDeviceReady() {
    		
    		setTimeout(function(){
    			zaNajava()
    		},4000);
    	
    	$("#glavna").live("pageshow", function(){
    		$('#sodrzina').css('margin-top',($("#glavna").outerHeight() - $('[data-role=header]').height() - $('[data-role=footer]').height() - $('#sodrzina').outerHeight())/2);
    	});

    	$('#firstName').keydown(function(event){
    		if (event.keyCode == 13) {
    			event.preventDefault();
    		}
    	});
    	$('#lastName').keydown(function(event){
    		if (event.keyCode == 13) {
    			event.preventDefault();
    		}
    	});
    	$('#imejl').keydown(function(event){
    		if (event.keyCode == 13) {
    			event.preventDefault();
    		}
    	});
    	
    	//SLIDER tekst so vesti od Milieu
    	
        $.get("http://milieukontakt.mk/?feed=rss2&lang=mk", {}, function(res, code) {
            entries = [];
            var xml = $(res);
            var items = xml.find("item");
            
            $.each(items, function(i, v){
                entry = {
                        naslov:$(v).find("title").text(),
                        link:$(v).find("link").text()
                };
                entries.push(entry);
            });
            var s='';
            $.each(entries, function(i,v) {
            //    alert(v.link);
                s+='<a href="'+ v.link + '">' + v.naslov + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>';
                $("#tekst").html(s).text();
            });
            	$("#tekst").html(s).text();
        });  
        /////////
        document.addEventListener("menubutton", onMenuKeyDown, false);
        // ZA BAZATA
    	
        $("input[name=vozrast]:radio").click(function() {
    		vozrastPole = $(this).val();
    	});
        
        $("input[name=pol]:radio").click(function() {
    		polPole = $(this).val();
    	});
        
        $("input[name=kategorija]:radio").click(function() {
        	
        	kategorija = $(this).val();
        	
        	$.mobile.showPageLoadingMsg("b", "Фотографијата се испраќа...", true);
            // gomail();
        
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        var latt;
        var lonn;
        var obj;
        function onSuccess(position) {
            
             latt = position.coords.latitude;
             lonn = position.coords.longitude;

             var objekt = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latt+","+lonn+"&sensor=true";
             $.get(objekt, function(data){
                  obj = data.results[0].formatted_address;
                  var name = obj;
                  var toRemove = '(FYROM)';
                  var lokacija = name.replace(toRemove,'');

                  var options = new FileUploadOptions();
                  options.fileKey="file";
                  options.fileName=slik.substr(slik.lastIndexOf('/')+1);
                  options.mimeType="image/jpeg";

                  var params = new Object();
                  params.value1 = "test";
                  params.value2 = "param";

                  options.params = params;
                  options.chunkedMode = false;

                  var ft = new FileTransfer();
                  ft.upload(slik, "http://fotografiraj.webatu.com/upload.php", win, fail, options);
                  
                  function win(r) {
                      console.log("Code = " + r.responseCode);
                      console.log("Response = " + r.response);
                      console.log("Sent = " + r.bytesSent);
                     
                      var a = r.response;
                    //  alert(a);
                      var a = a.replace(/\<\!\-\-.*/,'');
                     // alert(a);
                      var a1 = a.substr(0,13);
                    //  alert(a1);
                      
                      var postTo = 'http://fotografiraj.webatu.com/isprati11.php';
                      
                      $.post(postTo,{korisnikID: korisnikID, first_name: ime, last_name: prezime, email: posta, slika: a1, lok: lokacija, vozrast: vozrast, pol: pol, kategorija: kategorija})
                          	.done(function(data) {
                         // 	alert(data);
                        	})
                        	.fail(function() { 
                        		alert("Грешка при воспоставување конекција!");
                        		$.mobile.changePage("#glavna", {changeHash: false });
                        		$.mobile.hidePageLoadingMsg();
                        	});

                      $.mobile.hidePageLoadingMsg();
                      alert("Почитувани! Ви благодариме за пријавата. Истата ќе биде препратена до надлежните служби. \nСтатусот на пријавата ќе може да го следите на нашата веб страница: \nhttp://reagiram.mk");
                      $.mobile.changePage("#glavna", {changeHash: false });
                  }
                  
                  function fail(error) {
                      alert("Настаната е грешка при испраќањето, \nВе молиме обидете се повторно.");
                  }
             });
        
             
        } // position success
        
        function onError(error) {
            $.mobile.hidePageLoadingMsg();
            alert("Не се вклучени интернет или GPS услугите!");
            $.mobile.changePage("#glavna", {changeHash: false });
        }

        return false;
        	
        });
        
        var addButton = document.getElementById("add");
        firstNameBox = document.getElementById("firstName");
        lastNameBox = document.getElementById("lastName");
        postaBox = document.getElementById("imejl");
   //     dataTable = document.getElementById("data-table");
                    
        db = window.openDatabase("contactDB", "1.0", "Contact Database", 1000000);//name,version,display name, size

 //       zaNajava(); 

        addButton.addEventListener("click",function(){ 
        	
                    var firstName = firstNameBox.value;
                    var lastName = lastNameBox.value;
                    var email = postaBox.value;
                    var reg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                    vozrast = vozrastPole;
                    pol = polPole;
                    
                    if (firstName == "" || lastName == "" || email == "" || vozrastPole == null || polPole == null) {
                        alert("Не ги имате пополнето сите полиња!");
                    }
                    else if ( !reg.test(email) )
                    	{ alert("Внесете валидна email адреса!")}
                    else{                    	
                    	$.mobile.showPageLoadingMsg();
                        // ZEMI KORISNICKI ID	
                    	$.post("http://fotografiraj.webatu.com/test.php", { ime: firstName, prezime: lastName, email: email, vozrast: vozrast, pol: pol })
                    	.done(function(data) {
                            
                    		korisnikID = data.substr(0,13);

                    		db.transaction(
                            //function sql statements
                            function (tx){
                            ensureTableExists(tx);                   		
                            var sql = 'INSERT INTO Contacts (korisnikID,firstName,lastName,email,vozrast,pol) VALUES ("'+korisnikID+'","'+firstName+'","'+lastName+'","'+email+'","'+vozrast+'","'+pol+'")';
                            tx.executeSql(sql);
                            },
                            //error callback
                            function (err){
                                alert("error callback "+err.code);
                                                                
                            },
                            //success callback
                            function (err){
                            //alert("success callback "+err.code);
                            //    loadFromDB();
                            }); 
                            ime = firstName;
                            prezime = lastName;
                            posta = email;
                            
                            vozrastPole = null;
                            polPole = null;
                            
                            $.mobile.changePage("#glavna", {changeHash: false });

                    	})
                    	.fail(function() { 
                    		alert("Грешка при воспоставување конекција!");
                    		$.mobile.hidePageLoadingMsg();
                    	});
                    	///////////////////////             
                                                                                 
                    } // else            
            }, false);
                    
          
    
       
        
        // ZA BAZATA
        
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        
        $("#meni").live("pagebeforeshow", function(){
                procitajBaza();
            });  // MENI
        
        $("#prati").click(function(){
            if (slik == null)
            { alert("Немате фотографирано"); }
            else
                {
            		$.mobile.changePage("#kategorii", {changeHash: false });
                }
        });
        
    }   //  onDeviceReady
    
    
    function namestiPosleden(){
        db.transaction(
                function (tx){
                    ensureTableExists(tx);
                    tx.executeSql('SELECT * FROM Contacts', [], function(tx, results){
                        
                        var a = results.rows.length;
              /*          if (a === 0){
                         //   ime = "";
                         //  prezime = "";
                         //   posta = "";
                        $.mobile.changePage('#vnes',{ transition: "slideup", changeHash: false });
                        } */
                   //     else{
                            var ajtem = results.rows.item(a-1);   
                            ime = ajtem.firstName;
                            prezime = ajtem.lastName;
                            posta = ajtem.email;
                            
                            korisnikID = ajtem.korisnikID;
                            vozrast = ajtem.vozrast;
                            pol = ajtem.pol;
                            
                            $.mobile.changePage('#meni', {changeHash: false });
                      //      history.back();
                    //    }
                    },
                    function(err){
                        alert("Податоците од базата моментално не се достапни");
                    }); // tx execute )                                                                                             
                                                            
                    },
                    //error callback
                    function (err){
                        alert("error callback "+err.code+" "+err.message);
                    }
                );
    }

    function procitajBaza(){
        var baza = Array();
        db.transaction(
                //function sql statements
                function (tx){
                    ensureTableExists(tx);
                    tx.executeSql('SELECT * FROM Contacts', [], function(tx, results){
                    $("#lista").html("");
                    var htmlStr=""; 
                    for(var i=0;i<results.rows.length;i++){
                        baza.push(results.rows.item(i));                                              
                    
                    } // for

                    $(baza).each(function(b,val){
                        var htmlData = "<img height=\"80px;\" width=\"80px;\" src=\"img/pile.png\" /><div style=\"float: left;\"><h3>"+val.firstName+" "+val.lastName+"</h3></div><div id=\"brisi\" style=\"float: right;\" ><button onclick=\"deleteEntry('"+val.id+"');\">X</button></div>";
                        
                        var liElem = $(document.createElement('li'));
                        
                        $("#lista").append(liElem.html(htmlData));
                        $(liElem).bind("click", function(event){
                            ime = val.firstName;
                            prezime = val.lastName;
                            posta = val.email;
                            
                            korisnikID=val.korisnikID;
                            vozrast=val.vozrast;
                            pol=val.pol;
                            
                            var b = results.rows.length;
                            var ajtem = results.rows.item(b-1);
                            event.stopPropagation();

                            
                            zameniRedovi (val.id, ajtem.id);
                         

                            procitajBaza();
                            $.mobile.changePage('#glavna',{ changeHash: false });
                            return false;
                        });
               
                    });
               //     }
                    $("#lista").listview('refresh');
   
                }, // tx execute }
        
                function(err){
                    alert("Податоците од базата моментално не се достапни");
                }); // tx execute )                                                                                             
                                                        
                },
                //error callback
                function (err){
                    alert("error callback "+err.code+" "+err.message);
                },
                //success callback
                function (){
                    firstNameBox.value="";
                    lastNameBox.value="";
                    postaBox.value="";
                }
                ); // db.tramsaction 
        }	// procitaj baza
    
    function zameniRedovi(id1, id2){
        db.transaction(
                function (tx){
                 ensureTableExists(tx);
                tx.executeSql('UPDATE Contacts SET id=10 where id='+id2);
                tx.executeSql('UPDATE Contacts SET id='+id2+' where id='+id1);
                tx.executeSql('UPDATE Contacts SET id='+id1+' where id=10');
                },
                //error callback
                function (err){
                    alert("error callback "+err.code+" "+err.message);
                }
                );
    }
    
    function capturePhoto() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType.FILE_URI });
      }
 
    function onPhotoDataSuccess(imageData) {
    	
        var slika = document.getElementById('image');
        // Unhide image elements
        slik = imageData;
        slika.src = imageData;
        slika.style.display = 'block';
        slika.style.visibility = 'visible';
        slika.style.width = '100%';

      }

      // Called if something bad happens.
      // 
      function onFail(message) {
        alert('Настаната е грешка при фотографирање!');
      }

      function dodadi(){
    	  $.mobile.changePage('#vnes',{ transition: "pop", changeHash: false });
      };
      /////////////////////////////////////////////////////////
      /////////////////////////B A Z A ////////////////////////
      /////////////////////////////////////////////////////////
      
     
      // za najava
      
      function zaNajava(){
          
          db.transaction(
          //function sql statements
          function (tx){
              ensureTableExists(tx);
              tx.executeSql('SELECT * FROM Contacts', [], function(tx, results){
              var htmlStr=""; 
              if ( results.rows.length == 0 )
              {
            	  alert("Почитуван кориснику,\nВашите лични податоци се строго доверливи, истите нема да бидат неовластено заменети, злоупотребени или дадени на трети лица.");
                  $.mobile.changePage('#vnes', {changeHash: false });
              }
              else {
            	  $.mobile.changePage("#glavna", {changeHash: false });
                  var a = results.rows.length;
                  var ajtem = results.rows.item(a-1);   
                  ime = ajtem.firstName;
                  prezime = ajtem.lastName;
                  posta=ajtem.email;
                  
                  korisnikID=ajtem.korisnikID;
                  vozrast=ajtem.vozrast;
                  pol=ajtem.pol;
              }
            

          }, // tx execute }
  
          function(err){
              alert("Податоците од базата моментално не се достапни");
          }); // tx execute )                                                                                             
                                                  
          },
          //error callback
          function (err){
              alert("error callback "+err.code+" "+err.message);
          },
          //success callback
          function (){
              firstNameBox.value="";
              lastNameBox.value=""; 
              postaBox.value="";
          }); // db.tramsaction 
                          
      } // loadFromDB
      
      //
      
                  
      function deleteEntry(id){
          db.transaction(
          //function sql statements
          function (tx){
              ensureTableExists(tx);
              tx.executeSql('Delete FROM Contacts where id='+id);
              tx.executeSql('SELECT * FROM Contacts', [], function(tx, results){

                  if (results.rows.length === 0) {
                	  $.mobile.changePage('#vnes',{ transition: "slideup", changeHash: false });
                  }
                  else {
                	  namestiPosleden();
                  }
              });
          },
          //error callback
          function (err){
              alert("error callback "+err.code+" "+err.message);                          
          },
          //success callback
          function (err){
          //alert("success callback ");
            procitajBaza();          
  //        loadFromDB();                                                               
           }); // db.transaction
      } // delete entry
                  
      function ensureTableExists(tx){
                  tx.executeSql('CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY, korisnikID,firstName,lastName,email,vozrast,pol)');  
      }
      
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
      
      
      /** Called when browser load this page*/
      function init(){
          document.addEventListener("deviceready", onDeviceReady, false);
      }
      function onMenuKeyDown() { 
    	  $.mobile.changePage('#meni',{ transition: "pop", changeHash: false });
      }
